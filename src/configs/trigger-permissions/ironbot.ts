import { CommandConfig } from '../../types';

const triggerPermissions: CommandConfig[] = [
    {
        triggers: ['hello', 'channel-id', 'emoji-id', 'role-id'],
        channels: {
            blacklisted: [],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: []
    },
    {
        triggers: ['help'],
        channels: {
            blacklisted: [],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: []
    },
    {
        triggers: ['panic'],
        channels: {
            blacklisted: [],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: []
    },
    {
        triggers: ['add-event', 'eventSignupReaction'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '469498651434287107' // #attendance
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                '380065303440392203' // officers
            ]
        },
        permissionFlags: [],
        options: {
            requiredRoleName: 'Raider all',
            outputChannel: 'attendance-log'
        }
    },
    {
        triggers: ['deleteMessageReaction'],
        channels: {
            blacklisted: [],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: ['MANAGE_MESSAGES']
    }
];

export default triggerPermissions;
