import { Message, TextChannel, DMChannel, GroupDMChannel, GuildMember, RichEmbed } from 'discord.js';
import { DiscordUser, TriggerConfig } from '../typings';

export const matchesTrigger = (trigger: RegExp, message: string): boolean => {
    return trigger instanceof RegExp ? trigger.test(message) : false;
};

export const matchesReaction = (reactions: string[], emojiId: string): boolean => {
    return reactions.includes(emojiId);
};

export const sendToChannel = (channel: TextChannel | DMChannel | GroupDMChannel, reply: string | RichEmbed): void => {
    channel.send(reply).catch(error => console.error(error));
};

// export const sendError = (channel: TextChannel | DMChannel | GroupDMChannel, errorMessage: string): void => {
//     // TODO: move default to settings
//     const deleteErrorMessageDelay = 5000; // 0 never delete

//     channel.send(errorMessage).then((message: Message) => {
//         if (deleteErrorMessageDelay > 0) {
//             setTimeout(() => message.delete(), deleteErrorMessageDelay);
//         }
//     });
// };

export const getDiscordUser = (member: GuildMember): DiscordUser => {
    // const author = message.author;
    // const member = message.guild.members.find(member => member.id === author.id);

    if (!member) {
        console.error(`Could not find member in guild with ID (${member.id})`);
        return;
    }

    const username = member.nickname ? member.nickname : member.user.username;

    return {
        id: member.user.id,
        username: username,
        discriminator: member.user.discriminator,
        full: `${member.user.username}#${member.user.discriminator}/${member.id}`,
        ping: `<@${member.user.id}>`
    };
};

export const getRolesOfGuildMember = (member: GuildMember): string[] => {
    return Array.from(member.roles.keys());
};

export function getUsersWithRole(members: GuildMember[], withRole: string) {
    return members.filter(member => {
        const isNotBot = !member.user.bot;
        const hasRequiredRole = member.roles.some(role => role.name === withRole);
        return isNotBot && hasRequiredRole;
    });
}

export const getDiscordUsersWithRoleSorted = (channel: TextChannel, requiredRoleName: string): DiscordUser[] => {
    const membersSorted = getUsersWithRole(channel.members.array(), requiredRoleName).sort(
        (a: any, b: any) => a.username - b.username
    );

    let discordUsers: DiscordUser[] = [];
    membersSorted.forEach(member => discordUsers.push(getDiscordUser(member)));

    return discordUsers;
};

export const logExecution = (config: TriggerConfig): void => {
    const { message, trigger, reactionEvent } = config;
    const member = reactionEvent ? reactionEvent.member : message.member;
    const user = getDiscordUser(member);
    console.log(`${trigger.name} | ${user.full} executed trigger`);
};

export const logInit = (config: TriggerConfig): void => {
    const { message, trigger, reactionEvent } = config;
    const member = reactionEvent ? reactionEvent.member : message.member;
    const user = getDiscordUser(member);
    console.log(`${trigger.name} | initiated by ${user.full}`);
};

export const hasAdminPermissions = (config: TriggerConfig): boolean => {
    const { permissions, message } = config;
    if (permissions.admins.length > 0) {
        return permissions.admins.includes(message.author.id);
    }

    return true;
};

export const isConfigured = (config: TriggerConfig): boolean => {
    const { permissions, trigger } = config;
    const hasConfiguration = permissions != null;

    if (!hasConfiguration) {
        console.error(`${trigger.name} | no configuration found`);
    }

    return hasConfiguration;
};

export const authorHasPermission = (config: TriggerConfig): boolean => {
    const { trigger, message, permissions, reactionEvent } = config;
    const member = reactionEvent ? reactionEvent.member : message.member;
    const user = getDiscordUser(member);
    const roles = permissions.roles;
    const triggerAuthorRoles = getRolesOfGuildMember(member);

    // Does author have role which should be denied?
    if (roles.blacklisted.some((role: string) => triggerAuthorRoles.includes(role))) {
        console.error(`${trigger.name} | ${user.full} has blacklisted role`);
        return false;
    }

    // If whitelisted roles has '*' allow all roles that are not blacklisted
    if (roles.whitelisted[0] === '*') {
        // If blacklisted roles isn't empty there's contradiction.
        // All roles can't be allowed if n is blacklisted
        if (roles.blacklisted.length === 0) {
            console.log(`${trigger.name} | all roles are whitelisted`);
            return true;
        } else {
            console.error(`${trigger.name} | all roles are whitelisted but blacklist is not empty`);
            return false;
        }
    }

    // Does author have whitelisted role?
    if (roles.whitelisted.some(role => triggerAuthorRoles.includes(role))) {
        console.log(`${trigger.name} | ${user.full} has whitelisted role`);
        return true;
    }

    return false;
};

export const isAllowedChannel = (config: TriggerConfig): boolean => {
    const { trigger, message, permissions } = config;
    const channel = message.channel;
    const channels = permissions.channels;

    // Check if the channels message was sent is blacklisted
    if (channels.blacklisted.some(channelId => channelId == channel.id)) {
        console.error(`${trigger.name} | channel ${channel.id} is blacklisted`);
        return false;
    }

    // If whitelisted channels is '*' it means every channel should be allowed
    if (channels.whitelisted[0] === '*') {
        // If blacklisted channels isn't empty there's contradiction.
        // All channels can't be allowed if n is blacklisted
        if (channels.blacklisted.length === 0) {
            console.log(`${trigger.name} | all channels are whitelisted`);
            return true;
        } else {
            console.error(`${trigger.name} |  all channels are whitelisted but blacklist is not empty`);
            return false;
        }
    }

    // If not every channel is whitelisted we check for whitelisted channels
    if (channels.whitelisted.some(channelId => channelId == channel.id)) {
        console.log(`${trigger.name} | channel ${channel.id} is whitelisted`);
        return true;
    }

    return false;
};
