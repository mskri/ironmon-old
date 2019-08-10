import { Message } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import { sendToChannel } from '../../triggers/helpers';

export default createMessageTrigger({
    name: 'sayHello',
    trigger: new RegExp(/^hello\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);
    }
});
