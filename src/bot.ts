import { Client, Message, MessageReaction, Emoji, User, TextChannel, Guild } from 'discord.js';
import { TriggerPermissions, ReactionEvent } from './typings';
import { createMessageTriggerEvent, createReactionTriggerEvent } from './triggers/factory';
import { allowedReactionEvents, messageTriggerQueue, reactionTriggerQueue } from './triggers/queue';
import { matchesTrigger, matchesReaction } from './triggers/helpers';
import messageTriggers from './message-triggers';
import reactionTriggers from './reaction-triggers';

import preventDMs from './utils/preventDMs';
import triggerPermissions from './configs/trigger-permissions';

export const onGuildCreate = (guild: Guild) => {
    console.log(`Joined a new guild ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
};

export const onGuildDelete = (guild: Guild) => {
    console.log(`I have been removed from ${guild.name} (${guild.id})`);
};

export const onError = (error: Error) => {
    console.error(`Unexpected error happened: ${error.message}`);
};

export const onReady = (client: Client) => {
    console.log(`Logged in as ${client.user.username} (${client.user.id})`);
    console.log(`${client.user.username} reporting for duty!`);
};

export const onMessage = (client: Client, message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Ignore private messages (for now)
    if (preventDMs(client, message)) return;

    // Check if the message matches any triggers (commands)
    // Triggers are defined with regex and don't necessarily start with !command
    const trigger = messageTriggers.find(item => matchesTrigger(item.trigger, message.content));

    if (!trigger) return;

    const permissions = findTriggerPermissions(message.guild.id, trigger.name);
    const messageTrigger = createMessageTriggerEvent({ trigger, permissions, message });

    messageTriggerQueue.next(messageTrigger);
};

const findTriggerPermissions = (guildId: string, triggerName: string): TriggerPermissions => {
    return triggerPermissions[guildId].find(conf => conf.triggers.includes(triggerName));
};

export const onRaw = async (client: Client, event: any) => {
    if (!allowedReactionEvents.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user: User = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    // Ignore bots reactions and reactions on other channels than text
    // Reactions in DMs will have undefined channel
    if (user.bot || !channel || channel.type != 'text') return;

    console.log(`Received raw event ${event.t}`);

    // Get the message and emoji's from it (reactions) - Note: fetches only message from text channel!
    const message: Message = await (<TextChannel>channel).fetchMessage(data.message_id);

    const guild = client.guilds.get(data.guild_id);
    const member = guild.members.find(member => member.id === user.id);
    const emojiKey: string = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction: MessageReaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Reaction was not found in cache
        const emoji = new Emoji(guild, data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    const trigger = reactionTriggers.find(item => matchesReaction(item.reactions, reaction.emoji));

    if (!trigger) return;

    const reactionEvent: ReactionEvent = {
        type: event.t,
        reaction,
        member
    };

    const permissions = findTriggerPermissions(message.guild.id, trigger.name);
    const reactionTrigger = createReactionTriggerEvent({ trigger, permissions, message, reactionEvent });

    reactionTriggerQueue.next(reactionTrigger);
};
