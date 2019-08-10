import { Message, User, MessageReaction, Client, GuildMember } from 'discord.js';

export type MessageTriggerEvent = {
    logInit(): void;
    authorHasPermission(): boolean;
    isConfigured(): boolean;
    isAllowedChannel(): boolean;
    authorIsAdmin(): boolean;
    authorHasPermissionFlags(): boolean;
    execute(): void;
};

export type MessageTrigger = {
    name: string;
    trigger: RegExp;
    execute(message: Message): void;
};

export type TriggerPermissions = {
    triggers: string[];
    channels: PermissionChannels;
    roles: PermissionRoles;
    admins: string[];
    permissionFlags?: string[];
};

export type PermissionChannels = {
    blacklisted: string[];
    whitelisted: string[];
};

export type PermissionRoles = {
    blacklisted: string[];
    whitelisted: string[];
};

export type ReactionTrigger = {
    name: string;
    reactions: string[]; // ID or identifiers
    onAddReaction?: (message: Message, event: ReactionEvent) => void | null;
    onRemoveReaction?: (message: Message, event: ReactionEvent) => void | null;
};

export type TriggerConfig = {
    trigger: MessageTrigger | ReactionTrigger;
    permissions: TriggerPermissions;
    message: Message;
    reactionEvent?: ReactionEvent;
};

export type ReactionEvent = {
    type: string;
    reaction: MessageReaction;
    author: GuildMember;
};

export type ReactionTriggerEvent = {
    logInit: () => void;
    getType: () => string;
    authorHasPermission: () => boolean;
    isConfigured: () => boolean;
    isAllowedChannel: () => boolean;
    authorIsAdmin: () => boolean;
    authorHasPermissionFlags: () => boolean;
    onAddReaction: () => void;
    onRemoveReaction: () => void;
    hasAddReaction: () => boolean;
    hasRemoveReaction: () => boolean;
};

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
