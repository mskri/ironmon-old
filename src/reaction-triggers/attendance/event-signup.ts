import { Message, TextChannel } from 'discord.js';
import { ReactionEvent, EventData } from '../../typings';
import { createReactionTrigger } from '../../triggers/factory';
import { getDiscordUsersWithRoleSorted } from '../../triggers/helpers';
import { saveSingup } from '../../database/signups';
import { getEventByMessageId } from '../../database/events';

const requiredRole = 'Raider all';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        'accepted', // :accepted:
        'declined' // :declined:
    ],
    onAddReaction: async (message: Message, event: ReactionEvent) => {
        const { author, reaction } = event;
        const { channel } = message;

        // Remove the reaction of the person who added the reaction
        reaction.remove(author);

        const eventData: EventData = await getEventByMessageId(message.id);
        const members = getDiscordUsersWithRoleSorted(<TextChannel>channel, requiredRole);
        console.log(members);

        saveSingup('accepted', eventData.rowId, reaction.message.member.id);
    }
});
