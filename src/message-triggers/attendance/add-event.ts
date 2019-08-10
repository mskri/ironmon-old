import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import { Dayjs, UnitType } from 'dayjs';
import { Message, RichEmbed, TextChannel } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import {
    sendToChannelwithReactions,
    sendErrorToChannel,
    getDiscordUsersWithRoleSorted
} from '../../utils/trigger-helpers';
import { parseArgs, getMissingKeys } from '../../utils/parse-args';
import { DiscordUser } from '../../typings';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

type InputArgs = {
    title?: string;
    description?: string;
    color?: string;
    start?: string;
    end?: string;
    duration?: string;
    users?: boolean;
    url?: string;
};

type EventTime = {
    startHours: string;
    endHours: string;
    durationString: string;
};

type Duration = [number, UnitType];

const requiredRole = 'Raider all';
const timestampFormat = 'YYYY-MM-DDTHH:mmZ';
const requiredInputArgs = ['title', 'start', 'duration'];

const getDurationAdditions = (duration): Duration[] => {
    let additionsParams = duration.split(' ');
    let output: Duration[] = [];

    additionsParams.forEach((param: string) => {
        const indexOfFirstChar: number = param.indexOfRegex(/[a-zA-Z]/);
        const durationTime: number = parseInt(param.slice(0, indexOfFirstChar));
        const durationType: UnitType = <UnitType>param.slice(indexOfFirstChar);

        output.push([durationTime, durationType]);
    });

    return output;
};

const calculateEndTime = (startTime: Dayjs, duration: string): Dayjs => {
    const additions: Duration[] = getDurationAdditions(duration);
    additions.forEach(time => (startTime = startTime.add(time[0], time[1])));
    return startTime.utc();
};

const dayjsToTimezone = (date: Dayjs): Dayjs => {
    // TODO: improve timezone output
    // add 2 hours because the timestamp is parsed to utc and Europe/Berlin is +2
    return date.add(2, 'hour');
};

const getEventTime = (start: Dayjs, end: Dayjs): EventTime => {
    const diffInHours = end.diff(start, 'hour');
    const diffInMinutes = end.subtract(diffInHours, 'hour').diff(start, 'minute');

    const hours = diffInHours ? `${diffInHours} hours` : null;
    const minutes = diffInMinutes ? `${diffInMinutes} minutes` : null;
    const durationString = [hours, minutes].join(' ').trim();

    return {
        startHours: dayjsToTimezone(start).format('HH:mm'),
        endHours: dayjsToTimezone(end).format('HH:mm'),
        durationString
    };
};

const getDescription = (start: Dayjs, durationArg: string, description: string): string => {
    const end: Dayjs = calculateEndTime(start, durationArg);
    const startTime: string = start.format('dddd DD/MM');
    const { startHours, endHours, durationString } = getEventTime(start, end);
    const descriptionText = description ? `\n\n${description}` : '';
    return `${startTime} from ${startHours} to ${endHours} server time (${durationString})${descriptionText}`;
};

const formatFieldData = (users: DiscordUser[]): string =>
    users.length > 0 ? users.map(member => member.ping).join('\n') : '—';

const isHexColorFormat = (hex: string): boolean => /^#[0-9A-F]{3,6}$/i.test(hex);

export default createMessageTrigger({
    name: 'addEvent',
    trigger: new RegExp(/^!add-event\b/),
    execute: (message: Message) => {
        try {
            const defaults: InputArgs = {
                color: '#000000',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            };
            const { content, channel } = message;
            // Remove the command part, .e.g '!add', from beginning of the message
            const inputArgs = content.slice(this.default.trigger.length, content.length);
            const args = parseArgs(inputArgs, defaults);
            const missingKeys = getMissingKeys(requiredInputArgs, args);

            if (missingKeys.length > 0) {
                throw `Missing following arguments: ${missingKeys.join(', ')}`;
            }

            const { title, description, duration, url, color, start } = args;

            if (!isHexColorFormat(color)) {
                throw 'Invalid color format, should be hex value with 6 digits. E.g. #ff000.';
            }

            console.log(color);
            const startTimeDate: Dayjs = dayjs(start, timestampFormat).utc();

            if (!startTimeDate.isValid()) {
                throw `Invalid start time format, should be ${timestampFormat}`;
            }

            const body: string = getDescription(startTimeDate, duration, description);
            const participants: DiscordUser[] = getDiscordUsersWithRoleSorted(<TextChannel>channel, requiredRole);

            const embed: RichEmbed = new RichEmbed()
                .setColor(color)
                .setTitle(title)
                .setURL(url)
                .setAuthor('#1' /*, 'https://i.imgur.com/wSTFkRM.png'*/)
                .setDescription(body)
                .addBlankField()
                .addField(`Accepted (0})`, '—', true)
                .addField(`Declined (0)`, '—', true)
                .addBlankField()
                .addField(`Not set (${participants.length})`, formatFieldData(participants))
                .addBlankField()
                .setTimestamp()
                .setFooter('Set your status by reacting with the emojis below');

            const reactions = ['481485649732698124', '481485635836837888'];
            sendToChannelwithReactions(channel, embed, reactions);
        } catch (error) {
            console.error(`${this.default.name} | ${error}`);
            sendErrorToChannel(message.channel, error);
        }
    }
});