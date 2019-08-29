import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'sayHello',
    trigger: /hello/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);
    }
});
