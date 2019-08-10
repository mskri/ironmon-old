import { Message } from 'discord.js';
import { ReactionEvent } from '../../typings';
import { createReactionTrigger } from '../../triggers/factory';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        'accepted', // :accepted:
        'declined' // :declined:
    ],
    onAddReaction: (message: Message, event: ReactionEvent) => {
        event.reaction.remove();
    },
    onRemoveReaction: (message: Message, event: ReactionEvent) => {
        event.reaction.remove();
    }
});
