import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'getChannelId',
    trigger: /^!channel-id/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `This channel's ID is ${message.channel.id}`);
    }
});
