import { TriggerPermissions } from '../../typings';

const TriggerPermissions: TriggerPermissions[] = [
    {
        triggers: ['sayHello', 'getChannelId', 'getEmojiId', 'getRoleId'],
        guildId: '369588869794103297', // ironbot
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
        admins: ['302469039978971156']
    },
    {
        triggers: ['panic'],
        guildId: '369588869794103297', // ironbot
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
        admins: ['302469039978971156']
    },
    {
        triggers: ['smileReaction', 'eventSignupReaction'],
        guildId: '369588869794103297', // ironbot
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
        admins: ['302469039978971156']
    }
];

export default TriggerPermissions;

/**
 * Configurations for IronBot (testing) server
 */
/*
const guildConfig: GuildConfig = {
    guildId: '369588869794103297', // ironbot
    admins: ['302469039978971156'], // Saple
    reactionTriggers: [
        {
            name: 'Generic reactions',
            adminOnly: false,
            triggers: ['AttendanceReactionTrigger'],
            outputChannel: '553627580540911727', // #test
            channels: {
                blacklisted: [],
                whitelisted: ['553627580540911727'] // #test
            },
            roles: {
                blacklisted: [],
                whitelisted: ['380065303440392203'] // officers, '*' for allowing all roles
            },
            reactions: [
                {
                    id: '481485635836837888', // :accepted:
                    name: 'accepted',
                    category: 'Accepted',
                    color: 6939814
                },
                {
                    id: '481485663376637952', // :tentative:
                    name: 'tentative',
                    category: 'Tentative',
                    color: 16763523
                },
                {
                    id: '481485649732698124', // :declined:
                    name: 'declined',
                    category: 'Declined',
                    color: 16740997
                }
            ]
        }
    ],
    messageTriggers: [
        {
            name: 'Admins only',
            adminOnly: true,
            triggers: ['PanicTrigger'],
            channels: {
                blacklisted: [],
                whitelisted: ['553627580540911727'] // #test
            },
            roles: {
                blacklisted: [],
                whitelisted: ['380065303440392203'] // officers, '*' for allowing all roles
            }
        },
        {
            name: 'Generic commands',
            adminOnly: false,
            triggers: ['sayHello', 'ChannelIdTrigger', 'EmojiIdTrigger', 'RoleIdTrigger'],
            channels: {
                blacklisted: [],
                whitelisted: ['553627580540911727'] // #test
            },
            roles: {
                blacklisted: [],
                whitelisted: ['380065303440392203'] // officers, '*' for allowing all roles
            }
        },
        {
            name: 'Signup system',
            adminOnly: false,
            triggers: ['AddEventTrigger'],
            channels: {
                blacklisted: [],
                whitelisted: ['553627580540911727'] // #test
            },
            roles: {
                blacklisted: [],
                whitelisted: ['380065303440392203'] // officers, '*' for allowing all roles
            },
            requiredRole: '380065303440392203'
        }
    ]
};

export default guildConfig;
*/
