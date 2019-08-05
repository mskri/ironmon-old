import { Message } from 'discord.js';
import { createMessageTrigger } from '../message-trigger-factory';
import { sendToChannel } from '../../utils/trigger-helpers';

export default createMessageTrigger({
    name: 'sayHello',
    trigger: new RegExp(/^hello\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);
    }
});
