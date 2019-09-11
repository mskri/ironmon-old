import {
    DMChannel,
    GroupDMChannel,
    GuildMember,
    Message,
    PermissionString,
    TextChannel
} from 'discord.js';
import {
    PermissionChannels,
    PermissionRoles,
    CommandConfig,
    Action,
    Command,
    ActionEvent
} from '../types';

export const hasConfig = (config: CommandConfig | null): boolean => {
    return config != null;
};

export const isInAllowedChannel = (
    channels: PermissionChannels,
    channel: TextChannel | DMChannel | GroupDMChannel
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

export const authorHasPermissionFlags = (
    permissionFlags: PermissionString[],
    author: GuildMember
): boolean => {
    // TODO: will crash app, should not!
    if (!permissionFlags) throw new Error('No required permissionsFlags defined');
    if (permissionFlags.length === 0) return true;

    const hasAllRequiredPermissions = permissionFlags.every(flag => author.hasPermission(flag));

    if (!hasAllRequiredPermissions) {
        console.error(
            `User does not have required permission flags: (${permissionFlags.join(', ')}`
        );
        return false;
    }

    console.log(`User has required permission flags: (${permissionFlags.join(', ')})`);
    return true;
};

export const authorHasRole = (roles: PermissionRoles, author: GuildMember): boolean => {
    const { whitelisted, blacklisted } = roles;
    const authorRoles = Array.from(author.roles.keys());

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
    event: ActionEvent;
    author: GuildMember;
    message: Message;
    command: Command;
}): Action => {
    const { event, author, message, command } = opts;

    const executeOnAddReaction = (command: Command, event?: ActionEvent): void => {
        if (command.onAddReaction && event) {
            console.log('Execute onAddReaction');
            command.onAddReaction(message, event, author);
        }
    };

    const executeOnRemoveReaction = (command: Command, event?: ActionEvent): void => {
        if (command.onRemoveReaction && event) {
            console.log('Execute onRemoveReaction');
            command.onRemoveReaction(message, event, author);
        }
    };

    const executeOnMessage = (command: Command, message: Message): void => {
        if (command.execute && message) {
            console.log('Execute onMessage');
            command.execute(message);
        }
    };

    const execute = () => {
        switch (event.type) {
            case 'MESSAGE_REACTION_ADD':
                executeOnAddReaction(command, event);
                break;
            case 'MESSAGE_REACTION_REMOVE':
                executeOnRemoveReaction(command, event);
                break;
            case 'MESSAGE_CREATE':
                executeOnMessage(command, message);
        }
    };

    return Object.assign({}, opts, { execute, config: null });
};
