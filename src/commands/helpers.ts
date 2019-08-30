import {
    Message,
    TextChannel,
    DMChannel,
    GroupDMChannel,
    GuildMember,
    RichEmbed,
    ReactionEmoji,
    Emoji
} from 'discord.js';
import { Action, Command, CommandConfig } from '../typings';

// TODO: make logging better, maybe util function? Now e.g. user's details need to be parsed multiple times

export const addCommandConfigToAction = (configs: { [key: string]: CommandConfig[] }, action: Action): Action => {
    const { message, command } = action;
    const config = getCommandConfig(configs, message.guild.id, command.name);
    return Object.assign(action, { config });
};

export const getCommandConfig = (
    configs: { [key: string]: CommandConfig[] },
    guildId: string,
    triggerName: string
): CommandConfig | null => {
    return configs[guildId].find(conf => conf.triggers.includes(triggerName)) || null;
};

export const getMessageTrigger = (actions: Command[], message: string): Command | undefined => {
    const messageTriggers = actions.filter(action => action.type === 'MESSAGE');

    if (!messageTriggers) return;

    return messageTriggers.find(action => {
        const hasTrigger = action.trigger && action.trigger instanceof RegExp;
        if (!hasTrigger) return false;
        return action.trigger!.test(message);
    });
};

export const getReactionListener = (actions: Command[], emoji: Emoji | ReactionEmoji): Command | undefined => {
    const reactionListeners = actions.filter(action => action.type === 'REACTION');

    if (!reactionListeners) return;

    return reactionListeners.find(action => {
        const { reactions } = action;
        if (!reactions) return false;

        // Can we find matching reaction by id or name
        return reactions.includes(emoji.id) || reactions.includes(emoji.name);
    });
};

export const sendToChannel = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    message: string | RichEmbed
): Promise<Message> => {
    return channel.send(message).then(message => <Message>message);
};

export const sendErrorToChannel = (channel: TextChannel | DMChannel | GroupDMChannel, error: string): void => {
    channel
        .send(error)
        .then(message => (message as Message).react('❌'))
        .catch(error => console.error(error));
};

export const editMessage = (message: Message, embed: string | RichEmbed) => {
    return message.edit(embed).catch(error => console.error(error));
};

export const getRolesOfGuildMember = (member: GuildMember): string[] => {
    return Array.from(member.roles.keys());
};

export const getMembersWithRole = (members: GuildMember[], requiredRole: string): GuildMember[] => {
    return members.filter(member => {
        const isNotBot = !member.user.bot;
        const hasRequiredRole = member.roles.some(role => role.name === requiredRole);
        return isNotBot && hasRequiredRole;
    });
};

export const getMembersWithRoleSorted = (channel: TextChannel, requiredRole: string): GuildMember[] => {
    const membersWithRole = getMembersWithRole(channel.members.array(), requiredRole);
    return membersWithRole.sort((a: any, b: any) => a.username - b.username);
};
