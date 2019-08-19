import { WSEventType, Message, User, MessageReaction, Client, GuildMember, Emoji, PermissionString } from 'discord.js';
import { Dayjs, UnitType } from 'dayjs';

export type PermissionChannels = {
    blacklisted: string[];
    whitelisted: string[];
};

export type PermissionRoles = {
    blacklisted: string[];
    whitelisted: string[];
};

export type TriggerPermissions = {
    triggers: string[];
    channels: PermissionChannels;
    roles: PermissionRoles;
    admins: string[];
    permissionFlags: PermissionString[];
    options?: {
        [key: string]: string;
    };
};

export type TriggerEvent = {
    eventType: WSEventType;
    permissions: TriggerPermissions;
    author: GuildMember;
    message: Message;
    command?: Command;
    reactionListener?: ReactionListener;
    reactionMeta?: ReactionMeta;
    execute: () => void;
};

export type TriggerOpts = {
    eventType: WSEventType;
    permissions: TriggerPermissions;
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
    title?: string;
    details?: string;
    color?: string;
    start?: Dayjs;
    duration?: string;
    users?: boolean;
    url?: string;
};

export type Duration = [number, UnitType];

export type AttendanceEvent = {
    rowId: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
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
