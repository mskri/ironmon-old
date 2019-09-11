import { Message } from 'discord.js';
import { createCommand } from '../factory';

const { OWNER_DISCORD_ID } = process.env;

export default createCommand({
    type: 'MESSAGE',
    name: 'panic',
    trigger: /^!panic/,
    execute: (message: Message) => {
        if (message.author.id == OWNER_DISCORD_ID) process.exit(1);
    }
});
