import { Message, TextChannel } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'getRoleId',
    trigger: /^!role-id/,
    execute: (message: Message) => {
        const roleNameToSearchFor = message.content.replace(/^!\w+\s/, '');
        const channel = <TextChannel>message.channel;
        const role = channel.guild.roles.find(role => role.name.toLowerCase() === roleNameToSearchFor.toLowerCase());

        if (role) {
            sendToChannel(message.channel, role.id);
        } else {
            sendToChannel(message.channel, 'No such role found');
        }
    }
});
