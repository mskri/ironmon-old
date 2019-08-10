import { Message, TextChannel } from 'discord.js';
import { createMessageTrigger } from '../../triggers/factory';
import { sendToChannel } from '../../triggers/helpers';

export default createMessageTrigger({
    name: 'getRoleId',
    trigger: new RegExp(/^!role-id\b/),
    execute: (message: Message) => {
        const roleNameToSearchFor = message.content.replace(this.default.trigger, '').trim();
        const channel = <TextChannel>message.channel;
        const role = channel.guild.roles.find(role => role.name.toLowerCase() === roleNameToSearchFor.toLowerCase());

        if (role) {
            sendToChannel(message.channel, role.id);
        } else {
            sendToChannel(message.channel, 'No such role found');
        }
    }
});
