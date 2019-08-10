import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import { Dayjs, UnitType } from 'dayjs';
import { Message, RichEmbed, TextChannel } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import { sendToChannelwithReactions, sendErrorToChannel, getDiscordUsersWithRoleSorted } from '../../triggers/helpers';
import { parseArgs, findMissingKeys } from '../../utils/parse-args';
import { DiscordUser } from '../../typings';
import { isHexColorFormat, isValidTimestampFormat } from '../../utils/validators';
import { timestampFormat } from '../../configs/constants';
import apolloClient from '../../apollo';
import gql from 'graphql-tag';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

type Args = {
    title?: string;
    description?: string;
    color?: string;
    start?: string;
    end?: string;
    duration?: string;
    users?: boolean;
    url?: string;
};

type Duration = [number, UnitType];

type EventTime = {
    startHours: string;
    endHours: string;
    duration: string;
};

type EventData = {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    authorId: string;
    color: string;
    guildId: string;
    channelId: string;
    messageId: string;
    url: string;
    body: string;
    participants: DiscordUser[];
};

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

const getEventTime = (start: Dayjs, end: Dayjs): EventTime => {
    const diffInHours = end.diff(start, 'hour');
    const diffInMinutes = end.subtract(diffInHours, 'hour').diff(start, 'minute');
    const hours = diffInHours ? `${diffInHours} hours` : null;
    const minutes = diffInMinutes ? `${diffInMinutes} minutes` : null;

    return {
        startHours: dayjsToTimezone(start).format('HH:mm'),
        endHours: dayjsToTimezone(end).format('HH:mm'),
        duration: [hours, minutes].join(' ').trim()
    };
};

const getDescription = (start: Dayjs, end: Dayjs, description: string): string => {
    const { startHours, endHours, duration } = getEventTime(start, end);
    const startTime: string = start.format('dddd DD/MM');
    const descriptionText = description ? `\n\n${description}` : '';
    return `${startTime} from ${startHours} to ${endHours} server time (${duration})${descriptionText}`;
};

const formatFieldData = (users: DiscordUser[]): string => {
    if (users.length < 1) return '—';
    return users.map(member => member.ping).join('\n');
};

const createEventData = async (args: Args, message: Message): Promise<EventData> => {
    const { title, description, duration, url, color, start } = args;
    const { member, guild, channel } = message;

    const id = await apolloClient
        .query({
            query: gql`
                query {
                    allEvents(last: 1) {
                        nodes {
                            rowId
                        }
                    }
                }
            `
        })
        .then(result => {
            const rowId = result.data.allEvents.nodes[0].rowId;
            return `#${rowId}`;
        });

    // Use utc because dayjs doesn't have output timezone, we make the output to be GMT+2
    // by adding 2 hours to UTC
    const startTime: Dayjs = dayjs(start, timestampFormat).utc();
    const endTime: Dayjs = calculateEndTime(startTime, duration).utc();
    const body: string = getDescription(startTime, endTime, description);
    const participants: DiscordUser[] = getDiscordUsersWithRoleSorted(<TextChannel>channel, requiredRole);

    return {
        id,
        title,
        description,
        startTime: startTime.format(timestampFormat),
        endTime: endTime.format(timestampFormat),
        authorId: member.id,
        color,
        guildId: guild.id,
        channelId: channel.id,
        messageId: message.id,
        url,
        body,
        participants
    };
};

const createEmbed = (eventData: EventData): RichEmbed => {
    const { id, color, title, url, body, participants } = eventData;

    return new RichEmbed()
        .setColor(color)
        .setTitle(title)
        .setURL(url)
        .setAuthor(id /*, 'https://i.imgur.com/wSTFkRM.png'*/)
        .setDescription(body)
        .addBlankField()
        .addField(`Accepted (0)`, '—', true)
        .addField(`Declined (0)`, '—', true)
        .addBlankField()
        .addField(`Not set (${participants.length})`, formatFieldData(participants))
        .addBlankField()
        .setTimestamp()
        .setFooter('Set your status by reacting with the emojis below');
};

const storeEvent = (eventData: EventData): void => {
    apolloClient
        .mutate({
            variables: eventData,
            mutation: gql`
                mutation(
                    $title: String
                    $description: String
                    $startTime: Datetime
                    $endTime: Datetime
                    $authorId: String
                    $guildId: String
                    $channelId: String
                    $messageId: String
                    $color: String
                    $url: String
                ) {
                    createEvent(
                        input: {
                            event: {
                                title: $title
                                description: $description
                                startTime: $startTime
                                endTime: $endTime
                                authorId: $authorId
                                guildId: $guildId
                                channelId: $channelId
                                messageId: $messageId
                                color: $color
                                url: $url
                            }
                        }
                    ) {
                        event {
                            rowId
                        }
                    }
                }
            `
        })
        .then(_ => console.log(`${this.default.name} | Stored event ${eventData.id} to database`))
        .catch(error => console.log(error));
};

export default createMessageTrigger({
    name: 'addEvent',
    trigger: new RegExp(/^!add-event\b/),
    execute: async (message: Message) => {
        try {
            const { content, channel } = message;
            // Remove the command part, .e.g '!add', from beginning of the message
            const input: string = content.slice(this.default.trigger.length, content.length);
            const args: Args = parseArgs(input, defaultArgs);
            const missingKeys: string[] = findMissingKeys(requiredArgs, args);

            if (missingKeys.length > 0) {
                throw `Missing following arguments: ${missingKeys.join(', ')}`;
            }

            if (!isValidTimestampFormat(args.start)) {
                throw `Invalid start time format, should be ${timestampFormat}`;
            }

            if (!isHexColorFormat(args.color)) {
                throw 'Invalid color format, should be hex value with 6 digits. E.g. #ff000.';
            }

            const eventData = await createEventData(args, message);
            const embed = createEmbed(eventData);
            const reactions = ['481485649732698124', '481485635836837888'];

            sendToChannelwithReactions(channel, embed, reactions).then(_ => {
                storeEvent(eventData);
            });
        } catch (error) {
            console.error(`${this.default.name} | ${error}`);
            sendErrorToChannel(message.channel, error);
        }
    }
});
