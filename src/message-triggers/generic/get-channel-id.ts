import { Message } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import { sendToChannel } from '../../triggers/helpers';

export default createMessageTrigger({
    name: 'getChannelId',
    trigger: new RegExp(/^!channel-id\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, `This channel's ID is ${message.channel.id}`);
    }
});
