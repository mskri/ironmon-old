import {
    WSEventType,
    Message,
    User,
    MessageReaction,
    Client,
    GuildMember,
    Emoji,
    PermissionString
} from 'discord.js';

export type TriggerConfig = {
    triggers: string[];
    guildId: string;
    channels: {
        whitelisted: string[];
        blacklisted: string[];
    };
    roles: {
        whitelisted: string[];
        blacklisted: string[];
    };
    permissionFlags: String[];
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

export type ActionEvent = {
    type: WSEventType;
    reaction?: MessageReaction;
    emojiName?: string;
};

export type Action = {
    event: ActionEvent;
    author: GuildMember;
    message: Message;
    command: Command;
    execute: () => void;
    config: TriggerConfig | null;
};

export type ActionType = 'MESSAGE' | 'REACTION';

export type CommandHelp = {
    title: string;
    description: string;
    command: string;
    example?: string;
};

export type Command = {
    type: ActionType;
    name: string;
    help?: CommandHelp;
    trigger?: RegExp;
    reactions?: string[];
    execute?: (message: Message) => void;
    onAddReaction?: (
        message: Message,
        event: ActionEvent,
        author: GuildMember
    ) => Promise<void> | void;
    onRemoveReaction?: (
        message: Message,
        event: ActionEvent,
        author: GuildMember
    ) => Promise<void> | void;
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
    id: number;
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
    id: number;
    status: SignupStatus;
    eventId: string;
    userId: string;
};
