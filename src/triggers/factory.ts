import {
    PermissionString,
    GuildMember,
    Message,
    TextChannel,
    DMChannel,
    GroupDMChannel,
    WSEventType
} from 'discord.js';
import { Trigger, TriggerEvent, ReactionListener, TriggerPermissions, ReactionMeta } from '../typings';

const getRolesOfGuildMember = (member: GuildMember): string[] => Array.from(member.roles.keys());

const isInAllowedChannel = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    whitelistedChannels: string[],
    blacklistedChannels: string[]
): boolean => {
    // Check if the channels message was sent is blacklisted
    if (blacklistedChannels.some(channelId => channelId == channel.id)) {
        console.error(`Channel ${channel.id} is blacklisted`);
        return false;
    }

    // If whitelisted channels is '*' it means every channel should be allowed
    if (whitelistedChannels[0] === '*') {
        // If blacklisted channels isn't empty there's contradiction.
        // All channels can't be allowed if n is blacklisted
        if (blacklistedChannels.length !== 0) {
            console.error(`All channels are whitelisted but blacklist is not empty`);
            return false;
        }

        console.log(`All channels whitelisted`);
        return true;
    }

    // If not every channel is whitelisted we check for whitelisted channels
    if (whitelistedChannels.some(channelId => channelId == channel.id)) {
        console.error(`Channel ${channel.id} is whitelisted`);
        return true;
    }

    console.log(`Trigger was triggered in whitelisted channel`);
    return false;
};

const authorHasPermissionFlags = (author: GuildMember, permissionFlags: PermissionString[]): boolean => {
    if (!permissionFlags) throw new Error('No required permissionsFlags defined');
    if (permissionFlags.length === 0) return true;

    const hasAllRequiredPermissions = permissionFlags.every(flag => author.hasPermission(flag));

    if (!hasAllRequiredPermissions) {
        console.error(`User does not have required permission flags: (${permissionFlags.join(', ')}`);
        return false;
    }

    console.log(`User has required permission flags: (${permissionFlags.join(', ')})`);
    return true;
};

const authorIsAdmin = (author: GuildMember, admins: string[]): boolean => {
    return admins.length === 0 ? true : admins.includes(author.id);
};

const authorHasRole = (author: GuildMember, whitelisteddRoles: string[], blacklistedRoles: string[]): boolean => {
    const authorRoles = getRolesOfGuildMember(author);

    // Does author have role which should be denied?
    if (blacklistedRoles.some(role => authorRoles.includes(role))) {
        console.error(`User has blacklisted role`);
        return false;
    }

    // If whitelisted roles has '*' allow all roles that are not blacklisted
    if (whitelisteddRoles[0] === '*') {
        // If blacklisted roles isn't empty there's contradiction.
        // All roles can't be allowed if n is blacklisted
        if (blacklistedRoles.length !== 0) {
            console.error(`All roles are whitelisted but blacklist is not empty`);
            return false;
        }

        console.log(`All roles are whitelisted`);
        return true;
    }

    // Does author have whitelisted role?
    if (whitelisteddRoles.some(role => authorRoles.includes(role))) {
        console.log(`Author has whitelisted role`);
        return true;
    }

    console.log(`Author does not have required role`);
    return false;
};

// TODO: this is just for visual convenience so you can do createCommand({...}). Could be removed?
export const createCommand = (command: Trigger): Trigger => command;

// TODO: this is just for visual convenience so you can do createReactionListener({...}). Could be removed?
export const createReactionListener = (reactionListener: ReactionListener): ReactionListener => reactionListener;

export const createCommandEvent = (opts: {
    eventType: WSEventType;
    permissions: TriggerPermissions;
    author: GuildMember;
    message: Message;
    command?: Trigger;
    reactionListener?: ReactionListener;
    reactionMeta?: ReactionMeta;
}): TriggerEvent => {
    const { eventType, permissions, author, message, command, reactionListener, reactionMeta } = opts;

    const execute = () => {
        switch (eventType) {
            case 'MESSAGE_REACTION_ADD':
                if (reactionListener && reactionListener.onAddReaction && reactionMeta) {
                    console.log('Triggered onAddReaction');
                    reactionListener.onAddReaction(message, reactionMeta, author);
                }
                break;
            case 'MESSAGE_REACTION_REMOVE':
                if (reactionListener && reactionListener.onRemoveReaction && reactionMeta) {
                    console.log('Triggered onRemoveReaction');
                    reactionListener.onRemoveReaction(message, reactionMeta, author);
                }
                break;
            case 'MESSAGE_CREATE':
                if (command && command.execute) {
                    console.log('Triggered execute');
                    command.execute(message);
                }
        }
    };

    return {
        isInAllowedChannel: () =>
            isInAllowedChannel(message.channel, permissions.channels.whitelisted, permissions.channels.blacklisted),
        authorHasPermissionFlags: () => authorHasPermissionFlags(author, permissions.permissionFlags),
        authorIsAdmin: () => authorIsAdmin(author, permissions.admins),
        authorHasRole: () => authorHasRole(author, permissions.roles.whitelisted, permissions.roles.blacklisted),
        execute
    };
};
