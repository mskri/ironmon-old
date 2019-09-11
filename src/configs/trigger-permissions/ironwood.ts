import { CommandConfig } from '../../types';

const triggerPermissions: CommandConfig[] = [
    {
        triggers: ['hello'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '352889929212100619' // #general
            ]
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
            blacklisted: [],
            whitelisted: [
                '422779613073244160' // #attendance
            ]
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
        triggers: ['add-event'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '422779613073244160' // #attendance
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                '362570857370877953', // officers
                '519412435883524096' // botmanager
            ]
        },
        permissionFlags: [],
        options: {
            requiredRoleName: 'Mythic team',
            outputChannel: 'attendance-log'
        }
    },
    {
        triggers: ['eventSignupReaction'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '422779613073244160' // #attendance
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                '362559147184488449' // mythic team
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
