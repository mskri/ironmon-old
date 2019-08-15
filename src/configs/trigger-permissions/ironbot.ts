import { TriggerPermissions } from '../../typings';

const triggerPermissions: TriggerPermissions[] = [
    {
        triggers: ['sayHello', 'getChannelId', 'getEmojiId', 'getRoleId', 'addEvent'],
        channels: {
            blacklisted: [],
            whitelisted: [
                '553627580540911727' // #test
            ]
        },
        roles: {
            blacklisted: [],
            whitelisted: [
                '380065303440392203' // officers
            ]
        },
        admins: ['302469039978971156'],
        permissionFlags: []
    },
    {
        triggers: ['panic'],
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
        admins: ['302469039978971156'],
        permissionFlags: []
    },
    {
        triggers: ['eventSignupReaction'],
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
        admins: ['302469039978971156'],
        permissionFlags: []
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
        admins: [],
        permissionFlags: ['MANAGE_MESSAGES']
    }
];

export default triggerPermissions;
