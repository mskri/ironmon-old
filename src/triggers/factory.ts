import { Message, PermissionString, GuildMember, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import {
    Command,
    TriggerEvent,
    ReactionListener,
    PermissionRoles,
    PermissionChannels,
    TriggerOpts,
    ReactionMeta
} from '../typings';

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

    // If whitelisted channels is '*' it means every channel should be allowed
    if (whitelisted[0] === '*') {
        // If blacklisted channels isn't empty there's contradiction.
        // All channels can't be allowed if n is blacklisted
        if (blacklisted.length !== 0) {
            console.error(`All channels are whitelisted but blacklist is not empty`);
            return false;
        }

        console.log(`All channels whitelisted`);
        return true;
    }

    // If not every channel is whitelisted we check for whitelisted channels
    if (whitelisted.some(channelId => channelId == channel.id)) {
        console.error(`Channel ${channel.id} is whitelisted`);
        return true;
    }

    console.log(`Trigger was triggered in whitelisted channel`);
    return false;
};

export const authorHasPermissionFlags = (author: GuildMember, permissionFlags: PermissionString[]): boolean => {
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

export const authorIsAdmin = (author: GuildMember, admins: string[]): boolean => {
    return admins.length === 0 ? true : admins.includes(author.id);
};

export const authorHasRole = (author: GuildMember, roles: PermissionRoles): boolean => {
    const { whitelisted, blacklisted } = roles;
    const authorRoles = getRolesOfGuildMember(author);

    // Does author have role which should be denied?
    if (blacklisted.some(role => authorRoles.includes(role))) {
        console.error(`User has blacklisted role`);
        return false;
    }

    // If whitelisted roles has '*' allow all roles that are not blacklisted
    if (whitelisted[0] === '*') {
        // If blacklisted roles isn't empty there's contradiction.
        // All roles can't be allowed if n is blacklisted
        if (blacklisted.length !== 0) {
            console.error(`All roles are whitelisted but blacklist is not empty`);
            return false;
        }

        console.log(`All roles are whitelisted`);
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
export const createCommand = (command: Command): Command => command;

// TODO: this is just for visual convenience so you can do createReactionListener({...}). Could be removed?
export const createReactionListener = (reactionListener: ReactionListener): ReactionListener => reactionListener;

export const createCommandEvent = (opts: TriggerOpts): TriggerEvent => {
    const { eventType, author, message, command, reactionListener, reactionMeta } = opts;

    const executeOnAddReaction = (reactionListener?: ReactionListener, reactionMeta?: ReactionMeta) => {
        if (reactionListener && reactionListener.onAddReaction && reactionMeta) {
            console.log('Triggered onAddReaction');
            reactionListener.onAddReaction(message, reactionMeta, author);
        }
    };

    const executeOnRemoveReaction = (reactionListener?: ReactionListener, reactionMeta?: ReactionMeta) => {
        if (reactionListener && reactionListener.onRemoveReaction && reactionMeta) {
            console.log('Triggered onRemoveReaction');
            reactionListener.onRemoveReaction(message, reactionMeta, author);
        }
    };

    const executeOnMessage = (messageTrigger?: Command, message?: Message) => {
        if (messageTrigger && messageTrigger.execute && message) {
            console.log('Triggered messageTrigger');
            messageTrigger.execute(message);
        }
    };

    const execute = () => {
        switch (eventType) {
            case 'MESSAGE_REACTION_ADD':
                executeOnAddReaction(reactionListener, reactionMeta);
                break;
            case 'MESSAGE_REACTION_REMOVE':
                executeOnRemoveReaction(reactionListener, reactionMeta);
                break;
            case 'MESSAGE_CREATE':
                executeOnMessage(command, message);
        }
    };

    return Object.assign({}, opts, { execute });
};
