import MessageTriggerEvent from '../MessageTriggerEvent';
import parseCommand from '../../utils/parseCommand';
import { getMissingKeys } from '../../utils/requiredKeys';
import { getUsersWithRole, getDiscordMember } from '../../utils/discordHelper';
import { getEventTime } from '../../utils/timeHelper';
import { TextChannel, GuildMember, Collection } from 'discord.js';
import * as moment from 'moment-timezone';
import { Moment } from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';
import parseDuration from 'parse-duration';
import { DiscordUser } from '../../typings';

momentDurationFormatSetup(moment);

type AddEventInputArgs = {
    title?: string;
    body?: string;
    color?: string;
    start?: string;
    end?: string;
    duration?: string;
    users?: boolean;
    url: string;
};

type AddEventArgs = {
    title: string;
    body: string;
    color: number;
    startTime: Moment;
    endTime: Moment;
    showNotSetUsers: boolean;
    url: string;
};

import { Message } from 'discord.js';
import { createMessageTrigger } from '../../triggers/message-trigger-factory';

const checkIfRequiredKeysAreMissing = (args: AddEventInputArgs): void => {
    const missingKeys = getMissingKeys(['title', 'start'], args);
    if (missingKeys.length > 0) {
        throw new Error(`_Add event command is missing required keys: **${missingKeys.join(', ')}**_`);
    }
};

const checkIfTimestampsAreValid = (startTime: Moment, endTime: Moment): void => {
    if (!startTime.isValid()) {
        throw new Error('_Start timestamp is not valid ISO8601 format_');
    }

    if (!endTime.isValid()) {
        throw new Error('_End timestamp is not valid ISO8601 format_');
    }
};

const getDiscordUsersWithRoleSorted = (): DiscordUser[] => {
    const requiredRole = this._getTriggerConfig().requiredRole;
    return getUsersWithRole((<TextChannel>this.message.channel).members, requiredRole).sort(
        (a: any, b: any) => a.username - b.username
    );
};

const parseArguments = (message: string): AddEventArgs => {
    // TODO: move default to settings
    const defaultDuration: number = 10800; // 3 hours
    const defaultColor: number = 16777215; // FFFFFF
    const defaultUrl: string = 'https://google.com';

    // 'Sanitize' the input
    const inputString = JSON.stringify(message).slice(1, -1); // TODO: better way / really needed?
    const args: AddEventInputArgs = parseCommand(this.trigger, inputString);

    this.checkIfRequiredKeysAreMissing(args); // Throws error if missing keys

    const duration = args.duration ? parseDuration(args.duration) : defaultDuration;
    const startTime = moment(args.start, moment.ISO_8601);
    const endTime = args.end ? moment(args.end, moment.ISO_8601) : moment(args.start).add(duration, 'seconds');

    checkIfTimestampsAreValid(startTime, endTime);

    return {
        title: args.title || '',
        body: args.body || '',
        startTime,
        endTime,
        color: parseInt(args.color, 16) || defaultColor,
        showNotSetUsers: !args.users,
        url: args.url || defaultUrl
    };
};

export default createMessageTrigger({
    trigger: new RegExp(/^!event add\b/),
    name: 'addAttendanceEvent',
    execute: (message: Message) => {
        try {
            const { title, body, color, endTime, startTime, showNotSetUsers, url } = parseArguments(message.content);

            const fields = [];
            const participants: DiscordUser[] = getDiscordUsersWithRoleSorted();

            fields.push({
                name: `Accepted (0)`,
                value: '*â€”*',
                inline: true
            });

            fields.push({
                name: `Decline (0)`,
                value: '*â€”*',
                inline: true
            });

            if (showNotSetUsers && participants.length > 0) {
                fields.push({
                    name: `No status set (${participants.length})`,
                    value: participants.length > 0 ? participants.map(member => member.ping).join('\n') : '*â€”*'
                });
            }

            const timestamp = getEventTime(startTime, endTime);
            const description = `${timestamp.start} from ${timestamp.startHours} to ${timestamp.endHours} server time (${timestamp.durationString})\n\n${body}`;

            message.channel.send({
                embed: {
                    title,
                    description,
                    url,
                    color,
                    footer: {
                        text: 'Set your status by reacting with appropriate emoji'
                    },
                    timestamp: moment().format('yyyy-mm-ddthh-mm-ssz'),
                    author: {
                        name: `#id`
                    },
                    fields
                }
            });
        } catch (error) {
            // this._sendError(error.message);
            console.log(error);
        }
    }
});
