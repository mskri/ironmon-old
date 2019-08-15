import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import { UnitType, Dayjs } from 'dayjs';
import { RichEmbed, Message, GuildMember } from 'discord.js';
import { AttendanceEvent, InputArgs, Duration } from '../../typings';
import { timestampFormat } from '../../configs/constants';
import { fetchLastEventId } from '../../database/events';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export const dayjsToTimezone = (date?: Dayjs): Dayjs => {
    if (!date) return;
    // TODO: improve timezone output
    // Add 2 hours because the timestamp is parsed to utc and Europe/Berlin is +2
    return date.add(2, 'hour');
};

const getDurationAdditions = (duration: string): Duration[] => {
    const additionParams = duration.split(' ');
    const output: Duration[] = [];

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
    let endTime = startTime;

    additions.forEach(time => (endTime = endTime.add(time[0], time[1])));

    return endTime;
};

export const formatFieldData = (members: GuildMember[]): string => {
    if (members.length === 0) return '—';
    return members.map(member => `<@${member.id}>`).join('\n');
};

export const createEvent = async (args: InputArgs, message: Message): Promise<AttendanceEvent> => {
    const { member, guild, channel } = message;
    const { title, details, start, duration, color, url } = args;

    const end: Dayjs = calculateEndTime(start!, duration!);

    const userId: string = member.id;
    const guildId: string = guild.id;
    const channelId: string = channel.id;
    const startTime: string = dayjsToTimezone(start).format(timestampFormat);
    const endTime: string = dayjsToTimezone(end).format(timestampFormat);
    const description: string = getDetails(start!, end, details!);
    const rowId: number = await fetchLastEventId();

    return <AttendanceEvent>{
        rowId,
        title,
        description,
        startTime,
        endTime,
        color,
        url,
        userId,
        guildId,
        channelId,
        duration
    };
};

export const getDetails = (startTime: Dayjs, endTime: Dayjs, description: string): string => {
    const date: string = dayjsToTimezone(startTime).format('dddd DD/MM');
    const startHours: string = dayjsToTimezone(startTime).format('HH:mm');
    const endHours: string = dayjsToTimezone(endTime).format('HH:mm');
    const durationText: string = getDuration(startTime, endTime);
    const paragraph: string = `${date} from ${startHours} to ${endHours} server time (${durationText})`;

    return [paragraph, description].join('\n\n');
};

export const getDuration = (start: Dayjs, end: Dayjs): string => {
    const differenceInHours = end.diff(start, 'hour');
    const differenceInMinutes = end.subtract(differenceInHours, 'hour').diff(start, 'minute');
    const hours = differenceInHours ? `${differenceInHours} hours` : null;
    const minutes = differenceInMinutes ? `${differenceInMinutes} minutes` : null;

    return [hours, minutes].join(' ').trim();
};

export const createEmbedFields = (
    acceptedUsers: GuildMember[],
    declinedUsers: GuildMember[],
    noStatusUsers: GuildMember[]
): { name: string; value: string; inline?: boolean }[] => {
    return [
        {
            // Blank field for more visual space
            name: '\u200b',
            value: '\u200b'
        },
        {
            name: `Accepted (${acceptedUsers.length})`,
            value: formatFieldData(acceptedUsers),
            inline: true
        },
        {
            name: `Declined (${declinedUsers.length})`,
            value: formatFieldData(declinedUsers),
            inline: true
        },
        {
            // Blank field for more visual space
            name: '\u200b',
            value: '\u200b'
        },
        {
            name: `Not set (${noStatusUsers.length})`,
            value: formatFieldData(noStatusUsers)
        }
    ];
};

export const createEventEmbed = (data: {
    event: AttendanceEvent;
    noStatusUsers: GuildMember[];
    acceptedUsers: GuildMember[];
    declinedUsers: GuildMember[];
}): RichEmbed => {
    const { acceptedUsers, declinedUsers, noStatusUsers } = data;
    const { rowId, description, color, title, url } = data.event;
    const colorInt: number = parseInt(color.replace('#', '0x')) || 0x000000;
    const eventId = `#${rowId}`;
    const fields = createEmbedFields(acceptedUsers, declinedUsers, noStatusUsers);

    return new RichEmbed({
        color: colorInt,
        title,
        url,
        author: {
            name: eventId
        },
        description,
        fields,
        timestamp: new Date(),
        footer: {
            text: 'Set your status by reacting with the emojis below'
        }
    });
};
