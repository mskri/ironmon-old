import { RichEmbed, Message, GuildMember } from 'discord.js';
import { AttendanceEvent, InputArgs, SignupStatus } from '../../types';
import { fetchLastEventId } from '../../database/events';
import { addHours, addMinutes, differenceInHours, differenceInMinutes, subHours } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { timeZone } from '../../configs/constants';

const parseDurationAdditions = (duration: string): [number, string][] => {
    const additionParams = duration.split(' ');
    const output: [number, string][] = [];

    additionParams.forEach((param: string) => {
        const indexOfFirstChar: number = param.indexOfRegex(/[a-zA-Z]/);
        const time: number = parseInt(param.slice(0, indexOfFirstChar));
        const type: string = param.slice(indexOfFirstChar);

        output.push([time, type]);
    });

    return output;
};

const calculateEndTime = (startTime: Date, duration: string): Date => {
    const additions: [number, string][] = parseDurationAdditions(duration);
    let endTime: Date = startTime;

    additions.forEach(time => {
        if (time[1] === 'h') {
            endTime = addHours(endTime, time[0]);
        } else if (time[1] === 'm') {
            endTime = addMinutes(endTime, time[0]);
        }
    });

    return endTime;
};

export const formatFieldData = (members: GuildMember[]): string => {
    if (members.length === 0) return '—';
    return members.map(member => `<@${member.id}>`).join('\n');
};

export const createEvent = async (args: InputArgs, message: Message): Promise<AttendanceEvent> => {
    const { member, guild, channel } = message;
    const { title, details, start, duration, color, url } = args;

    const userId: string = member.id;
    const guildId: string = guild.id;
    const channelId: string = channel.id;
    const startTime: Date = start;
    const endTime: Date = calculateEndTime(startTime, duration);
    const description: string = createDescriptionText(startTime, endTime, details);

    const rowId: number = await fetchLastEventId();

    return {
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

export const createDescriptionText = (startTime: Date, endTime: Date, description: string): string => {
    const date: string = formatToTimeZone(startTime, 'dddd DD/MM', { timeZone });
    const startHours: string = formatToTimeZone(startTime, 'HH:mm', { timeZone });
    const endHours: string = formatToTimeZone(endTime, 'HH:mm', { timeZone });
    const duration: string = getDurationText(startTime, endTime);
    const paragraph: string = `${date} from ${startHours} to ${endHours} server time (${duration})`;

    return [paragraph, description].join('\n\n');
};

export const getDurationText = (start: Date, end: Date): string => {
    const diffInHours: number = differenceInHours(end, start);
    const differMinutes: number = differenceInMinutes(subHours(end, diffInHours), start);
    const hours = diffInHours ? `${diffInHours} hours` : null;
    const minutes = differMinutes ? `${differMinutes} minutes` : null;

    return [hours, minutes].join(' ').trim();
};

export const createEmbedFields = (
    acceptedUsers: GuildMember[],
    declinedUsers: GuildMember[],
    noStatusUsers: GuildMember[]
): { name: string; value: string; inline?: boolean }[] => {
    return [
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

export const createSignupNoticeEmbed = (
    author: GuildMember,
    eventId: string,
    color: number,
    status: SignupStatus,
    oldStatus?: SignupStatus | null
): RichEmbed => {
    const newStatus = `[#${eventId}] ${author.displayName} signed up as ${status}`;
    const changeStatus = `[#${eventId}] ${author.displayName} changed status to ${status}`;
    const title = oldStatus ? changeStatus : newStatus;

    return new RichEmbed({
        color,
        title,
        description: `<@${author.id}>`,
        timestamp: new Date()
    });
};
