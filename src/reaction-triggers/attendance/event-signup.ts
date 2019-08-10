import { Message } from 'discord.js';
import { ReactionEvent } from '../../typings';
import { createReactionTrigger } from '../../triggers/trigger-factory';
import { sendToChannel } from '../../utils/trigger-helpers';

export default createReactionTrigger({
    name: 'eventSignupReaction',
    reactions: [
        '481485635836837888', // accepted
        '481485663376637952', // tentative
        '481485649732698124' // declined
    ],
    onAddReaction: (message: Message, event: ReactionEvent) => {
        sendToChannel(message.channel, `Added ${event.reaction.emoji.name}`);
    },
    onRemoveReaction: (message: Message, event: ReactionEvent) => {
        sendToChannel(message.channel, `Removed ${event.reaction.emoji.name}`);
    }
});
