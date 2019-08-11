import { AttendanceEvent, Args, DiscordUser } from '../../typings';
import { Message, TextChannel, RichEmbed } from 'discord.js';
import { createMessageTrigger } from '../factory';
import { parseArgs, findMissingKeys } from '../../utils/parse-args';
import { isHexColorFormat } from '../../utils/validators';
import { saveUser, getUser } from '../../database/users';
import { saveEvent } from '../../database/events';
import { createEvent, createEventEmbed } from './attendance-helpers';
import {
    sendToChannelwithReactions,
    sendErrorToChannel,
    getDiscordUsersWithRoleSorted,
    getDiscordUser
} from '../helpers';

const requiredRole = 'Raider all'; // TODO: change to better one
const requiredArgs = ['title', 'start', 'duration'];
const defaultArgs: Args = {
    color: '#000000',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};
const reactionstoAdd = [
    '481485649732698124', // :declined:
    '481485635836837888' // :accepted:
];

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

            if (!args.start.isValid()) {
                throw `Invalid start time format`;
            }

            if (!isHexColorFormat(args.color)) {
                throw 'Invalid color format, should be hex value with 6 digits. E.g. #ff000.';
            }

            const event: AttendanceEvent = await createEvent(args, message);
            const noStatusUsers: DiscordUser[] = getDiscordUsersWithRoleSorted(<TextChannel>channel, requiredRole);
            const embed: RichEmbed = createEventEmbed({ event, noStatusUsers, acceptedUsers: [], declinedUsers: [] });

            const userData = await getUser(member.id);
            if (!userData) {
                const discordUser = getDiscordUser(member);
                await saveUser(discordUser);
            }

            sendToChannelwithReactions(channel, embed, reactionstoAdd).then(message => {
                saveEvent(event, message.id);
                // TODO: what to do if saveEvent fails? Should edit the posted event to say "Error saving event to database" or something?
            });
        } catch (error) {
            console.error(`${this.default.name} | ${error}`);
            sendErrorToChannel(message.channel, error);
        }
    }
});
