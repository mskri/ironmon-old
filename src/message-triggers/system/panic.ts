import { Message } from 'discord.js';
import { createMessageTrigger } from '../message-trigger-factory';

export default createMessageTrigger({
    trigger: new RegExp(/^!panic\b/),
    name: 'panic',
    execute: (_: Message) => {
        process.exit(1);
    }
});
