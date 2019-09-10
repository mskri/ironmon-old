import { CommandConfig } from '../../typings';

const triggerPermissions: CommandConfig[] = [
    {
        triggers: ['hello'],
        channels: {
            blacklisted: [
                '352889929212100619' // #general
            ],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: []
    },
    {
        triggers: ['channel-id', 'emoji-id', 'role-id'],
        channels: {
            blacklisted: [
                '422779613073244160' // #attendance
            ],
            whitelisted: []
        },
        roles: {
            blacklisted: [],
            whitelisted: []
        },
        permissionFlags: []
    },
    //'
    // {
    //     triggers: ['help'],
    //     channels: {
    //         blacklisted: [],
    //         whitelisted: []
    //     },
    //     roles: {
    //         blacklisted: [],
    //         whitelisted: []
    //     },
    //     permissionFlags: []
    // },
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
                '422779613073244160' // #attendance
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                // officers
            ]
        },
        permissionFlags: [],
        options: {
            requiredRoleName: 'Mythic team',
            outputChannel: 'attendance-log'
        }
    }
    // {
    //     triggers: ['deleteMessageReaction'],
    //     channels: {
    //         blacklisted: [],
    //         whitelisted: []
    //     },
    //     roles: {
    //         blacklisted: [],
    //         whitelisted: []
    //     },
    //     permissionFlags: ['MANAGE_MESSAGES']
    // }
];

export default triggerPermissions;
