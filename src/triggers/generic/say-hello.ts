import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createTrigger } from '../factory';

export default createTrigger({
    name: 'sayHello',
    trigger: /hello/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);
    }
});
