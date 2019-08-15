import { Message } from 'discord.js';
import { createCommand } from '../factory';

export default createCommand({
    name: 'panic',
    trigger: /^!panic/,
    execute: (_: Message) => {
        process.exit(1);
    }
});
