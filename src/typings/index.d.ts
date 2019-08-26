import { WSEventType, Message, User, MessageReaction, Client, GuildMember, Emoji, PermissionString } from 'discord.js';

export type TriggerConfig = {
    triggers: string[];
    channels: PermissionChannels;
    roles: PermissionRoles;
    permissionFlags: PermissionString[];
    options?: {
        [key: string]: string;
    };
};

export type PermissionChannels = {
    blacklisted: string[];
    whitelisted: string[];
};

export type PermissionRoles = {
    blacklisted: string[];
    whitelisted: string[];
};

export type TriggerEvent = {
    eventType: WSEventType;
    config: TriggerConfig;
    author: GuildMember;
    message: Message;
    command?: Command;
    reactionListener?: ReactionListener;
    reactionMeta?: ReactionMeta;
    execute: () => void;
};

export type TriggerOpts = {
    eventType: WSEventType;
    config: TriggerConfig;
    author: GuildMember;
    message: Message;
    command?: Command;
    reactionListener?: ReactionListener;
    reactionMeta?: ReactionMeta;
};

export type Command = {
    name: string;
    trigger: RegExp;
    execute: (message: Message) => void;
};

export type ReactionListener = {
    name: string;
    reactions: string[];
    onAddReaction?: (message: Message, meta: ReactionMeta, author: GuildMember) => Promise<void> | void;
    onRemoveReaction?: (message: Message, meta: ReactionMeta, author: GuildMember) => Promise<void> | void;
};

export type ReactionMeta = {
    reaction: MessageReaction;
    emojiName: string;
};

export type DiscordUser = {
    id: string;
    username: string;
    discriminator: string;
    displayName: string;
};

export type Reaction = {
    id: string;
    name: string;
    category: string;
    color: number;
};

export type InputArgs = {
    title: string;
    details: string;
    color: string;
    start: Date;
    duration: string;
    url: string;
};

export type AttendanceEvent = {
    rowId: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    color: string;
    url: string;
    userId: string;
    guildId: string;
    channelId: string;
    duration?: string;
};

export type SignupStatus = 'accepted' | 'declined';

export type Signup = {
    rowId: number;
    status: SignupStatus;
    eventId: string;
    userId: string;
    eventRowId: string;
};
