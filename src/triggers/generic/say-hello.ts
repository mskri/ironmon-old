import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    name: 'sayHello',
    trigger: /hello/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);
    }
});
