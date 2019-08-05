import { Message } from 'discord.js';
import { ReactionEvent } from '../../typings';
import { createReactionTrigger } from '../reaction-trigger-factory';
import { sendToChannel } from '../../utils/trigger-helpers';

export default createReactionTrigger({
    name: 'smileReaction',
    reactions: [
        '370860820449460224' // :woah:
    ],
    onAddReaction: (message: Message, event: ReactionEvent) => {
        sendToChannel(message.channel, `Added ${event.reaction.emoji.name}`);
    },
    onRemoveReaction: (message: Message, event: ReactionEvent) => {
        sendToChannel(message.channel, `Removed ${event.reaction.emoji.name}`);
    }
});
