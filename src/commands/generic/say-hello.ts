import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'hello',
    help: {
        title: 'Respond to hello',
        description: 'Replies "hello" to user',
        command: '"hello"',
        example: 'hello everyone!'
    },
    trigger: /hello/,
    execute: (message: Message) => {
        sendToChannel(message.channel, '👋');
    }
});
