import { Client, Message, MessageReaction, Emoji, TextChannel, Guild, ReactionEmoji, WSEventType } from 'discord.js';
import { Trigger, TriggerPermissions, ReactionMeta, ReactionListener } from './typings';
import { createCommandEvent } from './triggers/factory';
import { eventQueue } from './triggers/queue';
import { commands, reactions } from './triggers';

import preventDM from './utils/prevent-dm';
import triggerPermissions from './configs/trigger-permissions';

// Note: should match MESSAGE_REACTION_ADD or MESSAGE_REACTION_REMOVE from discord.js
// if discord.js changes that they should be changed to reflect the new ones here too.
const RAW_EVENTS_TO_LISTEN = ['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'];

const findMatchingCommand = (commands: Trigger[], message: string): Trigger | undefined => {
    return commands.find(command => (command.trigger instanceof RegExp ? command.trigger.test(message) : false));
};

const findMatchingReactionListener = (
    reactions: ReactionListener[],
    emoji: Emoji | ReactionEmoji
): ReactionListener | undefined => {
    return reactions.find(item => {
        const { reactions } = item;
        return reactions ? reactions.includes(emoji.id) || reactions.includes(emoji.name) : false;
    });
};

const findTriggerPermissions = (
    triggerPermissions: TriggerPermissions[],
    triggerName: string
): TriggerPermissions | undefined => {
    return triggerPermissions.find(conf => conf.triggers.includes(triggerName));
};

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
    const { username: botUsername, id: botId } = client.user;
    console.log(`Logged in as ${botUsername} (${botId})`);
    console.log(`Reporting for duty!`);
};

export const onMessage = (client: Client, message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Ignore private messages (for now)
    if (preventDM(client, message)) return;

    // Check if the message matches any triggers (commands)
    // Triggers are defined with regex and don't necessarily start with !command
    const command = findMatchingCommand(commands, message.content);
    if (!command) return;

    const triggerPermissionsForGuild = triggerPermissions[message.guild.id];
    const permissions: TriggerPermissions | undefined = findTriggerPermissions(
        triggerPermissionsForGuild,
        command.name
    );

    if (!permissions) return;

    const author = message.member;
    const eventType: WSEventType = 'MESSAGE_CREATE';
    const messageTrigger = createCommandEvent({ eventType, permissions, author, message, command });

    eventQueue.next(messageTrigger);
};

export const onRaw = async (client: Client, event: any) => {
    if (!RAW_EVENTS_TO_LISTEN.includes(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    if (!user || !channel) return;

    // Ignore bots reactions and reactions on other channels than text
    // Reactions in DMs will have undefined channel
    if (user.bot || !channel || channel.type != 'text') return;

    // Get the message and emoji's from it (reactions) - Note: fetches only message from text channel!
    const message: Message = await (<TextChannel>channel).fetchMessage(data.message_id);
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;

    const author = guild.members.find(member => member.id === user.id);
    const emojiKey: string = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

    let reaction = <MessageReaction>message.reactions.get(emojiKey);
    if (!reaction) {
        // Reaction was not found in cache
        const emoji = new Emoji(guild, data.emoji);
        const originatingFromMe = data.user_id === client.user.id;
        reaction = new MessageReaction(message, emoji, 1, originatingFromMe);
    }

    const reactionListener: ReactionListener | undefined = findMatchingReactionListener(reactions, reaction.emoji);
    if (!reactionListener) return;

    const reactionMeta: ReactionMeta = {
        reaction,
        emojiName: data.emoji.name
    };

    const triggerPermissionsForGuild = triggerPermissions[message.guild.id];
    const permissions: TriggerPermissions | undefined = findTriggerPermissions(
        triggerPermissionsForGuild,
        reactionListener.name
    );
    if (!permissions) return;

    const eventType = <WSEventType>event.t;
    const listenerEvent = createCommandEvent({
        eventType,
        permissions,
        author,
        message,
        reactionListener,
        reactionMeta
    });

    eventQueue.next(listenerEvent);
};
