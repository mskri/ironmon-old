import { Message } from 'discord.js';
import { createCommand } from '../factory';
import { OWNER_ID } from '../../configs/env';

export default createCommand({
    name: 'panic',
    trigger: /^!panic/,
    execute: (message: Message) => {
        if (message.author.id == OWNER_ID) process.exit(1);
    }
});
