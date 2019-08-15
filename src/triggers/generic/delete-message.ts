import { Message } from 'discord.js';
import { createReactionListener } from '../factory';

export default createReactionListener({
    name: 'deleteMessageReaction',
    reactions: [
        '❌' // :x:
    ],
    onAddReaction: (message: Message) => {
        message.delete();
    }
});
