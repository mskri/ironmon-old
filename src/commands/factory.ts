import {
    Message,
    PermissionString,
    GuildMember,
    TextChannel,
    DMChannel,
    GroupDMChannel,
    WSEventType
} from 'discord.js';
import { Command, Action, CommandConfig, PermissionRoles, PermissionChannels, ReactionMeta } from '../typings';

const getRolesOfGuildMember = (member: GuildMember): string[] => Array.from(member.roles.keys());

export const isInAllowedChannel = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    channels: PermissionChannels
): boolean => {
    const { whitelisted, blacklisted } = channels;

    // Check if the channels message was sent is blacklisted
    if (blacklisted.some((channelId: string) => channelId == channel.id)) {
        console.error(`Channel ${channel.id} is blacklisted`);
        return false;
    }

    // If whitelisted and blacklisted channels are both empty every channel should be allowed
    if (whitelisted.length === 0 && blacklisted.length === 0) {
        console.log(`All channels allowed`);
        return true;
    }

    // If not every channel is whitelisted we check for whitelisted channels
    if (whitelisted.some(channelId => channelId == channel.id)) {
        console.error(`Channel ${channel.id} is whitelisted`);
        return true;
    }

    console.log('Not allowed in channel');
    return false;
};

export const authorHasPermissionFlags = (author: GuildMember, permissionFlags: PermissionString[]): boolean => {
    // TODO: will crash app, should not!
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

export const authorHasRole = (author: GuildMember, roles: PermissionRoles): boolean => {
    const { whitelisted, blacklisted } = roles;
    const authorRoles = getRolesOfGuildMember(author);

    // Does author have role which should be denied?
    if (blacklisted.some(role => authorRoles.includes(role))) {
        console.error(`User has blacklisted role`);
        return false;
    }

    // If whitelisted and blacklisted roles are both empty allow all roles
    if (whitelisted.length === 0 && blacklisted.length === 0) {
        console.log(`All roles are allowed`);
        return true;
    }

    // Does author have whitelisted role?
    if (whitelisted.some(role => authorRoles.includes(role))) {
        console.log(`Author has whitelisted role`);
        return true;
    }

    console.log(`Author does not have required role`);
    return false;
};

// TODO: this is just for visual convenience so you can do createCommand({...}). Could be removed?
// Once configs per command are in database combine the configuration with the command here and pass it along?
export const createCommand = (command: Command): Command => command;

export const createAction = (opts: {
    eventType: WSEventType;
    config: CommandConfig;
    author: GuildMember;
    message: Message;
    action: Command;
    reactionMeta?: ReactionMeta;
}): Action => {
    const { eventType, author, message, action, reactionMeta } = opts;

    const executeOnAddReaction = (action: Command, reactionMeta?: ReactionMeta): void => {
        if (action.onAddReaction && reactionMeta) {
            console.log('Execute onAddReaction');
            action.onAddReaction(message, reactionMeta, author);
        }
    };

    const executeOnRemoveReaction = (action: Command, reactionMeta?: ReactionMeta): void => {
        if (action.onRemoveReaction && reactionMeta) {
            console.log('Execute onRemoveReaction');
            action.onRemoveReaction(message, reactionMeta, author);
        }
    };

    const executeOnMessage = (action: Command, message: Message): void => {
        if (action.execute && message) {
            console.log('Execute onMessage');
            action.execute(message);
        }
    };

    const execute = () => {
        switch (eventType) {
            case 'MESSAGE_REACTION_ADD':
                executeOnAddReaction(action, reactionMeta);
                break;
            case 'MESSAGE_REACTION_REMOVE':
                executeOnRemoveReaction(action, reactionMeta);
                break;
            case 'MESSAGE_CREATE':
                executeOnMessage(action, message);
        }
    };

    return Object.assign({}, opts, { execute });
};
