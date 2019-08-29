import { Message } from 'discord.js';
import { createCommand } from '../factory';

export default createCommand({
    type: 'REACTION',
    name: 'deleteMessageReaction',
    reactions: [
        '❌' // :x:
    ],
    onAddReaction: (message: Message) => {
        message.delete();
    }
});
