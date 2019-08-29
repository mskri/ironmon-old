import { Client, Message, MessageReaction, Emoji, TextChannel, Guild, WSEventType, GuildMember } from 'discord.js';
import { ReactionMeta } from './typings';
import { createTriggerEvent } from './triggers/factory';
import { eventQueue } from './triggers/queue';
import { getMatchingTrigger, getMatchingReactionListener, getTriggerConfig } from './triggers/helpers';
import { triggers, reactions } from './triggers';
import preventDM from './utils/prevent-dm';
import configs from './configs/trigger-permissions';

// Note: should match MESSAGE_REACTION_ADD or MESSAGE_REACTION_REMOVE from discord.js
// if discord.js changes that they should be changed to reflect the new ones here too.
const RAW_EVENTS_TO_LISTEN = ['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'];

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
    const trigger = getMatchingTrigger(triggers, message.content);
    if (!trigger) return;

    const config = getTriggerConfig(configs, message.guild.id, trigger.name);
    if (!config) return;

    const author: GuildMember = message.member;
    const messageTrigger = createTriggerEvent({
        eventType: 'MESSAGE_CREATE',
        config,
        author,
        message,
        trigger
    });

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

    const reactionListener = getMatchingReactionListener(reactions, reaction.emoji);
    if (!reactionListener) return;

    const reactionMeta: ReactionMeta = {
        reaction,
        emojiName: data.emoji.name
    };

    const config = getTriggerConfig(configs, guild.id, reactionListener.name);
    if (!config) return;

    const listenerEvent = createTriggerEvent({
        eventType: <WSEventType>event.t,
        config,
        author,
        message,
        reactionListener,
        reactionMeta
    });

    eventQueue.next(listenerEvent);
};
