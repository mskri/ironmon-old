import { Message } from 'discord.js';
import { ReactionEvent } from '../../typings';
import { createReactionTrigger } from '../../triggers/factory';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        '481485635836837888', // accepted
        '481485663376637952', // tentative
        '481485649732698124' // declined
    ],
    onAddReaction: (message: Message, event: ReactionEvent) => {
        event.reaction.remove();
    },
    onRemoveReaction: (message: Message, event: ReactionEvent) => {
        event.reaction.remove();
    }
});
