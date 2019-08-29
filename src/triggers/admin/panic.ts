import { Message } from 'discord.js';
import { createTrigger } from '../factory';
import { OWNER_ID } from '../../configs/env';

export default createTrigger({
    name: 'panic',
    trigger: /^!panic/,
    execute: (message: Message) => {
        if (message.author.id == OWNER_ID) process.exit(1);
    }
});
