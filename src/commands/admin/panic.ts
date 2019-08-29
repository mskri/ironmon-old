import { Message } from 'discord.js';
import { OWNER_ID } from '../../configs/env';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'panic',
    trigger: /^!panic/,
    execute: (message: Message) => {
        if (message.author.id == OWNER_ID) process.exit(1);
    }
});
