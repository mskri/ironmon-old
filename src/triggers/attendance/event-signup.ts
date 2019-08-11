import { Message, TextChannel, GuildMember, RichEmbed } from 'discord.js';
import { ReactionEvent, Signup, SignupStatus } from '../../typings';
import { createReactionTrigger } from '../factory';
import { getGuildMembersWithRoleSorted } from '../helpers';
import { saveSingup, getSignup, updateSignup } from '../../database/signups';
// import { getEventByMessageId } from '../../database/events';

const requiredRole = 'Raider all';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        'accepted', // :accepted:
        'declined' // :declined:
    ],
    onAddReaction: async (message: Message, event: ReactionEvent) => {
        const { author, reaction, emojiName } = event;
        const { channel } = message;

        // Remove the reaction of the person who added the reaction
        reaction.remove(author);

        const status: SignupStatus = emojiName === 'accepted' ? 'accepted' : 'declined';
        // const eventData: EventData = await getEventByMessageId(reaction.message.id);
        // const members: GuildMember[] = getGuildMembersWithRoleSorted(<TextChannel>channel, requiredRole);
        // console.log(members);

        const signup: Signup = await getSignup(author.id, reaction.message.id);
        console.log(reaction.message.embeds);
        if (signup) {
            if (status != signup.status) {
                updateSignup(signup, status);
            } else {
                console.log('Already same status do nothing');
            }
        } else {
            saveSingup(status, message.id, author.id);
        }

        // TODO message log channel
    }
});

// TODO make the message and event.reaction more clear. For reactions the msg the reaction was added is different
// in command the message.id is the one we should use
