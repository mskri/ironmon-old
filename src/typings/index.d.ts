import { WSEventType, Message, User, MessageReaction, Client, GuildMember, Emoji, PermissionString } from 'discord.js';

export type CommandConfig = {
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

export type Action = {
    eventType: WSEventType;
    config: CommandConfig;
    author: GuildMember;
    message: Message;
    execute: () => void;
};

export type ActionType = 'MESSAGE' | 'REACTION';

export type Command = {
    type: ActionType;
    name: string;
    trigger?: RegExp;
    reactions?: string[];
    execute?: (message: Message) => void;
    onAddReaction?: (message: Message, meta: ReactionMeta, author: GuildMember) => Promise<void> | void;
    onRemoveReaction?: (message: Message, meta: ReactionMeta, author: GuildMember) => Promise<void> | void;
};

// TODO: change to generic "event meta" object?
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
