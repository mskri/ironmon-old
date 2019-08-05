import { Message } from 'discord.js';
import { MessageTriggerEvent, MessageTrigger, TriggerPermissions } from '../typings';
import { getDiscordUser, getAuthorRolesArray } from '../utils/trigger-helpers';

// export const sendError = (channel: TextChannel | DMChannel | GroupDMChannel, errorMessage: string): void => {
//     // TODO: move default to settings
//     const deleteErrorMessageDelay = 5000; // 0 never delete

//     channel.send(errorMessage).then((message: Message) => {
//         if (deleteErrorMessageDelay > 0) {
//             setTimeout(() => message.delete(), deleteErrorMessageDelay);
//         }
//     });
// };

export const createMessageTrigger = (messageTrigger: MessageTrigger): MessageTrigger => {
    return messageTrigger;
};

export const createMessageTriggerEvent = (
    trigger: MessageTrigger,
    triggerPermissions: TriggerPermissions,
    message: Message
): MessageTriggerEvent => {
    const logExecution = (): void => {
        const user = getDiscordUser(message);
        console.log(`${user.full} executed ${trigger.name}`);
    };

    const hasAdminPermissions = (): boolean => {
        if (triggerPermissions.admins.length > 0) {
            return triggerPermissions.admins.includes(message.author.id);
        }

        return true;
    };

    const isConfigured = (): boolean => {
        const hasConfiguration = triggerPermissions != null;

        if (!hasConfiguration) {
            console.error(`No configuration found for ${trigger.name}`);
        }

        return hasConfiguration;
    };

    const isAllowedChannel = (): boolean => {
        const channel = message.channel;
        const channels = triggerPermissions.channels;

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

    const authorHasPermission = (): boolean => {
        const user = getDiscordUser(message);
        const authorRoles = getAuthorRolesArray(message);
        const roles = triggerPermissions.roles;

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

    const execute = (): void => {
        logExecution();
        trigger.execute(message);
    };

    return {
        isConfigured,
        isAllowedChannel,
        hasAdminPermissions,
        logExecution,
        authorHasPermission,
        execute
    };
};
