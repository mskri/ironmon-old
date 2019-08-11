import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import { Args, Duration, DiscordUser, EventData, EventMeta, EventTime } from '../../typings';
import { Dayjs, UnitType } from 'dayjs';
import { Message, TextChannel, RichEmbed } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import {
    sendToChannelwithReactions,
    sendErrorToChannel,
    getDiscordUsersWithRoleSorted,
    getDiscordUser
} from '../../triggers/helpers';
import { parseArgs, findMissingKeys } from '../../utils/parse-args';
import { isHexColorFormat } from '../../utils/validators';
import { timestampFormat } from '../../configs/constants';
import { saveUser, getUser } from '../../database/users';
import { saveEvent, getLastEventId } from '../../database/events';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const requiredRole = 'Raider all';
const requiredArgs = ['title', 'start', 'duration'];
const defaultArgs: Args = {
    color: '#000000',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

const getDurationAdditions = (duration: string): Duration[] => {
    let additionParams = duration.split(' ');
    let output: Duration[] = [];

    additionParams.forEach((param: string) => {
        const indexOfFirstChar: number = param.indexOfRegex(/[a-zA-Z]/);
        const time: number = parseInt(param.slice(0, indexOfFirstChar));
        const type: UnitType = <UnitType>param.slice(indexOfFirstChar);

        output.push([time, type]);
    });

    return output;
};

const calculateEndTime = (startTime: Dayjs, duration: string): Dayjs => {
    const additions: Duration[] = getDurationAdditions(duration);

    additions.forEach(time => {
        startTime = startTime.add(time[0], time[1]);
    });

    return startTime;
};

const dayjsToTimezone = (date: Dayjs): Dayjs => {
    // TODO: improve timezone output
    // Add 2 hours because the timestamp is parsed to utc and Europe/Berlin is +2
    return date.add(2, 'hour');
};

const formatFieldData = (users: DiscordUser[]): string => {
    if (users.length < 1) return '—';
    return users.map(member => member.ping).join('\n');
};

const createEventTime = (start: Dayjs, duration: string): EventTime => {
    // Use utc because dayjs doesn't have output timezone, we make the output to be GMT+2
    // by adding 2 hours to UTC

    const endTime: Dayjs = calculateEndTime(start, duration).utc();
    const diffInHours = endTime.diff(start, 'hour');
    const diffInMinutes = endTime.subtract(diffInHours, 'hour').diff(start, 'minute');
    const hours = diffInHours ? `${diffInHours} hours` : null;
    const minutes = diffInMinutes ? `${diffInMinutes} minutes` : null;

    return {
        startTime: dayjsToTimezone(start).format('dddd DD/MM'),
        startHours: dayjsToTimezone(start).format('HH:mm'),
        endHours: dayjsToTimezone(endTime).format('HH:mm'),
        duration: [hours, minutes].join(' ').trim()
    };
};

const getDescription = (timestamp: EventTime, description: string): string => {
    const { startTime, startHours, endHours, duration } = timestamp;
    const descriptionText = description ? `\n\n${description}` : '';
    return `${startTime} from ${startHours} to ${endHours} server time (${duration})${descriptionText}`;
};

const createEventMeta = (message: Message): EventMeta => {
    const { member, guild, channel } = message;
    const authorId: string = member.id;
    const guildId: string = guild.id;
    const channelId: string = channel.id;
    const messageId: string = message.id;

    return {
        authorId,
        guildId,
        channelId,
        messageId
    };
};

const createEventData = async (args: Args): Promise<EventData> => {
    const { title, description, duration, url, color, start } = args;

    const rowId: number = await getLastEventId();

    // Use utc because dayjs doesn't have output timezone, we make the output to be GMT+2
    // by adding 2 hours to UTC
    const startTime: Dayjs = dayjs(start, timestampFormat).utc();
    // const startTime: string = startDate.format(timestampFormat);
    // const endTime: string = endDate.format(timestampFormat);
    const endTime: Dayjs = calculateEndTime(startTime, duration).utc();

    return {
        rowId,
        title,
        description,
        startTime,
        endTime,
        color,
        url
    };
};

const createEventEmbed = (eventData: EventData, description: string, participants: DiscordUser[]): RichEmbed => {
    const { rowId, color, title, url } = eventData;
    const colorInt: number = parseInt(color.replace('#', '0x'));

    const embed = {
        color: colorInt,
        title,
        url,
        author: {
            name: `#${rowId}`
        },
        description,
        fields: [
            {
                // Blank field for more visual space
                name: '\u200b',
                value: '\u200b'
            },
            {
                name: `Accepted (0)`,
                value: '—',
                inline: true
            },
            {
                name: `Declined (0)`,
                value: '—',
                inline: true
            },
            {
                // Blank field for more visual space
                name: '\u200b',
                value: '\u200b'
            },
            {
                name: `Not set (${participants.length})`,
                value: formatFieldData(participants)
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'Set your status by reacting with the emojis below'
        }
    };

    return new RichEmbed(embed);
};

export default createMessageTrigger({
    name: 'addEvent',
    trigger: new RegExp(/^!add-event\b/),
    execute: async (message: Message) => {
        try {
            const { content, channel, member } = message;

            // Remove the command part, .e.g '!add', from beginning of the message
            const input: string = content.slice(this.default.trigger.length, content.length);
            const args: Args = parseArgs(input, defaultArgs);
            const missingKeys: string[] = findMissingKeys(requiredArgs, args);

            if (missingKeys.length > 0) {
                throw `Missing following arguments: ${missingKeys.join(', ')}`;
            }

            const { start: startTime, duration, description } = args;

            if (!startTime.isValid()) {
                throw `Invalid start time format, should be ${timestampFormat}`;
            }

            if (!isHexColorFormat(args.color)) {
                throw 'Invalid color format, should be hex value with 6 digits. E.g. #ff000.';
            }

            const eventData: EventData = await createEventData(args);
            const eventMeta: EventMeta = createEventMeta(message);
            const eventTime: EventTime = createEventTime(startTime, duration);
            const body: string = getDescription(eventTime, description);
            const participants: DiscordUser[] = getDiscordUsersWithRoleSorted(<TextChannel>channel, requiredRole);
            const embed: RichEmbed = createEventEmbed(eventData, body, participants);
            const reactionstoAdd = [
                '481485649732698124', // :declined:
                '481485635836837888' // :accepted:
            ];

            const userData = await getUser(member.id);
            if (!userData) {
                const discordUser = getDiscordUser(member);
                await saveUser(discordUser);
            }

            sendToChannelwithReactions(channel, embed, reactionstoAdd).then(_ => {
                saveEvent(eventData, eventMeta);
                // TODO: what to do if saveEvent fails? Should edit the posted event to say "Error saving event to database" or something?
            });
        } catch (error) {
            console.error(`${this.default.name} | ${error}`);
            sendErrorToChannel(message.channel, error);
        }
    }
});
