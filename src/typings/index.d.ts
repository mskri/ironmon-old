import { Message, User, MessageReaction, Client, GuildMember } from 'discord.js';

export type MessageTriggerEvent = {
    logInit(): void;
    authorHasPermission(): boolean;
    isConfigured(): boolean;
    isAllowedChannel(): boolean;
    hasAdminPermissions(): boolean;
    execute(): void;
};

export type MessageTrigger = {
    name: string;
    trigger: RegExp;
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

export type ReactionTrigger = {
    name: string;
    reactions: string[];
    onAddReaction(message: Message, event: ReactionEvent): void;
    onRemoveReaction(message: Message, event: ReactionEvent): void;
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
    member: GuildMember;
};

export type ReactionTriggerEvent = {
    logInit(): void;
    getType(): string;
    authorHasPermission(): boolean;
    isConfigured(): boolean;
    isAllowedChannel(): boolean;
    hasAdminPermissions(): boolean;
    onAddReaction(): void;
    onRemoveReaction(): void;
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
