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
import { TriggerPermissions, Command, ReactionListener } from '../typings';

// TODO: make logging better, maybe util function? Now e.g. user's details need to be parsed multiple times

export const findTriggerPermissions = (
    triggerPermissions: TriggerPermissions[],
    triggerName: string
): TriggerPermissions | undefined => {
    return triggerPermissions.find(conf => conf.triggers.includes(triggerName));
};

export const findMatchingCommand = (commands: Command[], message: string): Command | undefined => {
    return commands.find(command => (command.trigger instanceof RegExp ? command.trigger.test(message) : false));
};

export const findMatchingReactionListener = (
    reactions: ReactionListener[],
    emoji: Emoji | ReactionEmoji
): ReactionListener | undefined => {
    return reactions.find(item => {
        const { reactions } = item;
        return reactions ? reactions.includes(emoji.id) || reactions.includes(emoji.name) : false;
    });
};

export const matchesTrigger = (trigger: RegExp | undefined, message: string): boolean => {
    if (!trigger) return false;
    return trigger instanceof RegExp ? trigger.test(message) : false;
};

export const matchesReaction = (reactions?: string[], emoji?: Emoji | ReactionEmoji): boolean => {
    if (!reactions || !emoji) return false;
    return reactions.includes(emoji.id) || reactions.includes(emoji.name);
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
    return message.edit(embed);
};

export const getRolesOfGuildMember = (member: GuildMember): string[] => {
    return Array.from(member.roles.keys());
};

export function getMembersWithRole(members: GuildMember[], withRole: string) {
    return members.filter(member => {
        const isNotBot = !member.user.bot;
        const hasRequiredRole = member.roles.some(role => role.name === withRole);
        return isNotBot && hasRequiredRole;
    });
}

export const getMembersWithRoleSorted = (channel: TextChannel, requiredRoleName: string): GuildMember[] => {
    return getMembersWithRole(channel.members.array(), requiredRoleName).sort(
        (a: any, b: any) => a.username - b.username
    );
};
