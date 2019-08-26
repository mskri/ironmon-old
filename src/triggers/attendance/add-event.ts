import { AttendanceEvent, InputArgs } from '../../typings';
import { Message, TextChannel, RichEmbed, GuildMember } from 'discord.js';
import { createCommand } from '../factory';
import { sendToChannel, editMessage } from '../helpers';
import { parseArgs, findMissingKeys } from '../../utils/parse-args';
import { isHexColorFormat } from '../../utils/validators';
import { saveUser, checkIfUserExists } from '../../database/users';
import { saveEvent } from '../../database/events';
import { createEvent, createEventEmbed } from './attendance-helpers';
import { sendErrorToChannel, getMembersWithRoleSorted } from '../helpers';
import { isValid } from 'date-fns';

const requiredRole = 'Raider all'; // TODO: change to better one
const requiredArgs = ['title', 'start', 'duration'];
const defaultArgs = {
    color: '#000000',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};
const reactionstoAdd = [
    '481485635836837888', // :accepted:
    '481485649732698124' // :declined:
];

export default createCommand({
    name: 'addEvent',
    trigger: /^!add-event/,
    execute: async (message: Message) => {
        try {
            const { content, channel, member } = message;

            // Remove the command part, .e.g '!add', from beginning of the message
            const input: string = content.replace(/^!\w+\s/, '').trim();
            const args: InputArgs = <InputArgs>parseArgs(input, defaultArgs); // TODO: refactoring required
            const missingKeys: string[] = findMissingKeys(requiredArgs, args);
            const { start, color } = args;

            if (missingKeys.length > 0) {
                throw `Missing following arguments: ${missingKeys.join(', ')}`;
            }

            if (start && !isValid(new Date())) {
                throw new Error('Invalid start time format');
            }

            if (color && !isHexColorFormat(color)) {
                throw new Error('Invalid color format, should be hex value with 6 digits. E.g. #ff000.');
            }

            const event: AttendanceEvent = await createEvent(args, message);
            const noStatusUsers: GuildMember[] = getMembersWithRoleSorted(<TextChannel>channel, requiredRole);
            const userExists: boolean = await checkIfUserExists(member.id);

            if (!userExists) {
                try {
                    await saveUser(member);
                } catch (error) {
                    throw new Error('could not save user');
                }
            }

            sendToChannel(channel, 'Creating new event...').then(async message => {
                await saveEvent(event, message.id).catch(_ => {
                    message.delete();
                    throw new Error('could not save event');
                }); // TODO: handle errors, change message + add delete emoji

                const embed: RichEmbed = createEventEmbed({
                    event,
                    noStatusUsers,
                    acceptedUsers: [],
                    declinedUsers: []
                });

                editMessage(message, embed);

                for (const emoji of reactionstoAdd) {
                    await message.react(emoji);
                }
            });
        } catch (error) {
            console.error(`addEvent | ${error}`);
            sendErrorToChannel(message.channel, `Error creating new event: ${error.message}`);
        }
    }
});
