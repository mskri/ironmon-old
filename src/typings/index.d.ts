import { Message, User, MessageReaction, Client } from 'discord.js';

export type MessageTriggerEvent = {
    logExecution(): void;
    authorHasPermission(): boolean;
    isConfigured(): boolean;
    isAllowedChannel(): boolean;
    hasAdminPermissions(): boolean;
    execute(): void;
};

export type MessageTrigger = {
    trigger: RegExp;
    name: string;
    execute(message: Message): void;
};

export type TriggerPermissions = {
    triggers: string[];
    guildId: string;
    channels: PermissionChannels;
    roles: PermissionRoles;
    admins: string[];
};

export type PermissionChannels = {
    blacklisted: string[];
    whitelisted: string[];
};

export type PermissionRoles = {
    blacklisted: string[];
    whitelisted: string[];
};

export interface ReactionTriggerEvent {
    type: string;
    client: Client;
    reaction: MessageReaction;
    user: User;
}

export type DiscordUser = {
    id: string;
    username: string;
    discriminator: string;
    full: string;
    ping: string;
};

export type Reaction = {
    id: string;
    name: string;
    category: string;
    color: number;
};

