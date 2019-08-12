import { Message, TextChannel, GuildMember, RichEmbed } from 'discord.js';
import { ReactionEvent, Signup, SignupStatus } from '../../typings';
import { createReactionTrigger } from '../factory';
import { getMembersWithRoleSorted, editMessage } from '../helpers';
import { saveSingup, updateSignupStatus, getSignupsForEventByEventId } from '../../database/signups';
import { upsertUser } from '../../database/users';
import { createEmbedFields } from './attendance-helpers';

const requiredRole = 'Raider all';

const memberHasNoStatus = (signups: Signup[], member: GuildMember): boolean => {
    return !signups.map(signup => signup.userId).includes(member.id);
};

const displayNameAlphabetically = (a: GuildMember, b: GuildMember) => a.displayName.localeCompare(b.displayName);

const emojiNameToSignupStatus = (emojiName: string): SignupStatus =>
    emojiName === 'accepted' ? 'accepted' : 'declined';

const isAccepted = (signup: Signup): boolean => signup.status === 'accepted';

const isDeclined = (signup: Signup): boolean => signup.status === 'declined';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        'accepted', // :accepted:
        'declined' // :declined:
    ],
    onAddReaction: async (message: Message, event: ReactionEvent) => {
        const { author, reaction, emojiName } = event;
        const { channel, guild } = message;

        // Remove the reaction of the person who added the reaction
        reaction.remove(author);

        const newStatus: SignupStatus = emojiNameToSignupStatus(emojiName);
        const allSignups: Signup[] = await getSignupsForEventByEventId(reaction.message.id);
        const membersInChannel: GuildMember[] = getMembersWithRoleSorted(<TextChannel>channel, requiredRole);
        const oldSignup: Signup = allSignups.find(signup => signup.userId == author.id);

        if (oldSignup) {
            if (oldSignup.status !== newStatus) {
                oldSignup.status = newStatus;
                updateSignupStatus(oldSignup, newStatus);
            } else {
                // Already same status do nothing
                return;
            }
        } else {
            await upsertUser(author);
            const storedSignup: Signup = await saveSingup(newStatus, message.id, author.id);
            allSignups.push(storedSignup);
        }

        const acceptedUsers: GuildMember[] = allSignups
            .filter(isAccepted)
            .map(signup => guild.members.find(member => member.id === signup.userId))
            .sort(displayNameAlphabetically);

        const declinedUsers: GuildMember[] = allSignups
            .filter(isDeclined)
            .map(signup => guild.members.find(member => member.id === signup.userId))
            .sort(displayNameAlphabetically);

        const noStatusUsers: GuildMember[] = membersInChannel
            .filter(member => memberHasNoStatus(allSignups, member))
            .filter(member => member.id !== author.id)
            .sort(displayNameAlphabetically);

        const receivedEmbed = reaction.message.embeds[0];
        const embed = new RichEmbed(receivedEmbed);
        embed.fields = createEmbedFields(acceptedUsers, declinedUsers, noStatusUsers);
        embed.timestamp = new Date();

        editMessage(reaction.message, embed);
        // TODO message log channel
        // TODO add 'update event' emoji to update event from db?
        // TODO make the message and event.reaction more clear. For reactions the msg the reaction was added is different in command the message.id is the one we should use
    }
});
