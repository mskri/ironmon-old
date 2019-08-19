import { TriggerConfig } from '../../typings';

const triggerPermissions: TriggerConfig[] = [
    {
        triggers: ['sayHello', 'getChannelId', 'getEmojiId', 'getRoleId'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '553627580540911727' // #test
            ]
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
        triggers: ['addEvent', 'eventSignupReaction'],
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
            whitelisted: [
                '*' // all channels allowed
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                '380065303440392203' // officers
            ]
        },
        permissionFlags: ['MANAGE_MESSAGES']
    }
];

export default triggerPermissions;
