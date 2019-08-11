import { Message } from 'discord.js';
import { createMessageTrigger } from '../factory';
import { sendToChannel } from '../helpers';

export default createMessageTrigger({
    name: 'getChannelId',
    trigger: new RegExp(/^!channel-id\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, `This channel's ID is ${message.channel.id}`);
    }
});
