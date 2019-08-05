import { Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { DiscordUser, MessageTriggerConfig, ReactionTriggerConfig } from '../typings';

export const matchesTrigger = (trigger: RegExp, message: string): boolean => {
    return trigger instanceof RegExp ? trigger.test(message) : false;
};

export const matchesReaction = (reactions: string[], emojiId: string): boolean => {
    return reactions.includes(emojiId);
};

export const sendToChannel = (channel: TextChannel | DMChannel | GroupDMChannel, reply: string): void => {
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

export const getDiscordUser = (message: Message): DiscordUser => {
    const author = message.author;
    const member = message.guild.members.find(member => member.id === author.id);

    if (!member) {
        console.error(`Could not find member in guild with ID (${author.id})`);
        return;
    }

    const username = member.nickname ? member.nickname : member.user.username;

    return {
        id: member.user.id,
        username: username,
        discriminator: member.user.discriminator,
        full: `${username} (${member.user.username}#${member.user.discriminator}/${author.id})`,
        ping: `<@${member.user.id}>`
    };
};

export const getAuthorRolesArray = (message: Message): string[] => {
    return Array.from(message.member.roles.keys());
};

export const logExecution = (config: MessageTriggerConfig | ReactionTriggerConfig): void => {
    const { message, trigger } = config;
    const user = getDiscordUser(message);
    console.log(`${user.full} executed ${trigger.name}`);
};

export const hasAdminPermissions = (config: MessageTriggerConfig | ReactionTriggerConfig): boolean => {
    const { permissions, message } = config;
    if (permissions.admins.length > 0) {
        return permissions.admins.includes(message.author.id);
    }

    return true;
};

export const isConfigured = (config: MessageTriggerConfig | ReactionTriggerConfig): boolean => {
    const { permissions } = config;
    const hasConfiguration = permissions != null;

    if (!hasConfiguration) {
        console.error(`No configuration found for ${config.trigger.name}`);
    }

    return hasConfiguration;
};

export const authorHasPermission = (config: MessageTriggerConfig | ReactionTriggerConfig): boolean => {
    const { trigger, message, permissions } = config;
    const user = getDiscordUser(message);
    const authorRoles = getAuthorRolesArray(message);
    const roles = permissions.roles;

    // Does author have role which should be denied?
    if (roles.blacklisted.some((role: string) => authorRoles.includes(role))) {
        console.log(`Author has role which is blacklisted for ${trigger.name}`);
    }

    // If whitelisted roles has '*' allow all roles that are not blacklisted
    if (roles.whitelisted[0] === '*') {
        // If blacklisted roles isn't empty there's contradiction.
        // All roles can't be allowed if n is blacklisted
        if (roles.blacklisted.length === 0) {
            console.log('All roles whitelisted');
            return true;
        } else {
            console.error('All roles whitelisted but blacklist is not empty!');
            return false;
        }
    }

    // Does author have whitelisted role?
    if (roles.whitelisted.some((role: string) => authorRoles.includes(role))) {
        console.log(`Author ${user.full} has whitelisted role`);
        return true;
    }

    return false;
};

export const isAllowedChannel = (config: MessageTriggerConfig | ReactionTriggerConfig): boolean => {
    const { trigger, message, permissions } = config;
    const channel = message.channel;
    const channels = permissions.channels;

    // Check if the channels message was sent is blacklisted
    if (channels.blacklisted.some(channelId => channelId == channel.id)) {
        console.log(`Channel ${channel.id} is blacklisted for ${trigger.name}`);
        return false;
    }

    // If whitelisted channels is '*' it means every channel should be allowed
    if (channels.whitelisted[0] === '*') {
        // If blacklisted channels isn't empty there's contradiction.
        // All channels can't be allowed if n is blacklisted
        if (channels.blacklisted.length === 0) {
            console.log(`All channels whitelisted for ${trigger.name}`);
            return true;
        } else {
            console.error(`All channels whitelisted for ${trigger.name} but blacklist is not empty`);
            return false;
        }
    }

    // If not every channel is whitelisted we check for whitelisted channels
    if (channels.whitelisted.some(channelId => channelId == channel.id)) {
        console.log(`Channel ${channel.id} is whitelisted for ${trigger.name}`);
        return true;
    }

    return false;
};
