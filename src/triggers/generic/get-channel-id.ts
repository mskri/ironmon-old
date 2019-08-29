import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createTrigger } from '../factory';

export default createTrigger({
    name: 'getChannelId',
    trigger: /^!channel-id/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `This channel's ID is ${message.channel.id}`);
    }
});
