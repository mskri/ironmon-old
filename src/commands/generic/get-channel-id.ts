import { Message } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'channel-id',
    help: {
        title: 'Get channel ID',
        description: 'Returns ID of the channel the command is triggered.',
        command: '!channel-id'
    },
    trigger: /^!channel-id/,
    execute: (message: Message) => {
        sendToChannel(message.channel, `This channel's ID is ${message.channel.id}`);
    }
});
