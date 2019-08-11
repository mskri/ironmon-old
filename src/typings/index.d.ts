import { Message, User, MessageReaction, Client, GuildMember, Emoji } from 'discord.js';
import { Dayjs, UnitType } from 'dayjs';

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
    emojiName: string;
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
    nickname: string;
    username: string;
    discriminator: string;
    full: string;
    ping: string;
};

// TODO: combine all different user types (e.g. DiscordUser) into a single user type with optional fields (e.g. full and ping)
type DbUser = {
    id: string;
    username: string;
    discordUsername: string;
    discordDiscriminator: string;
};

export type Reaction = {
    id: string;
    name: string;
    category: string;
    color: number;
};

export type Args = {
    title?: string;
    description?: string;
    color?: string;
    start?: Dayjs;
    duration?: string;
    users?: boolean;
    url?: string;
};

export type Duration = [number, UnitType];

export type EventTime = {
    startTime: string;
    startHours: string;
    endHours: string;
    duration: string;
};

export type EventData = {
    rowId: number;
    title: string;
    description: string;
    startTime: Dayjs;
    endTime: Dayjs;
    color: string;
    url: string;
};

export type EventMeta = {
    userId: string;
    guildId: string;
    channelId: string;
};

type SignupStatus = 'accepted' | 'declined';

type Signup = {
    rowId: number;
    status: SignupStatus;
    eventId: string;
    userId: string;
};
