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
import { TriggerConfig, Trigger, ReactionListener } from '../typings';

// TODO: make logging better, maybe util function? Now e.g. user's details need to be parsed multiple times

export const getTriggerConfig = (
    configs: { [key: string]: TriggerConfig[] },
    guildId: string,
    triggerName: string
): TriggerConfig | undefined => {
    return configs[guildId].find(conf => conf.triggers.includes(triggerName));
};

export const getMatchingTrigger = (triggers: Trigger[], message: string): Trigger | undefined => {
    return triggers.find(trigger => {
        const isRegExp = trigger.trigger instanceof RegExp;
        if (!isRegExp) return false;
        return trigger.trigger.test(message);
    });
};

export const getMatchingReactionListener = (
    reactions: ReactionListener[],
    emoji: Emoji | ReactionEmoji
): ReactionListener | undefined => {
    return reactions.find(item => {
        const { reactions } = item;
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
