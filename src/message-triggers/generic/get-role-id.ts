import { Message, TextChannel } from 'discord.js';
import { createMessageTrigger } from '../message-trigger-factory';
import { sendToChannel } from '../../utils/trigger-helpers';

export default createMessageTrigger({
    name: 'getRoleId',
    trigger: new RegExp(/^!role-id\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, this.message.channel.id);

        const roleNameToSearchFor = this.message.content.replace(this.trigger, '').trim();
        const channel = <TextChannel>this.message.channel;
        const role = channel.guild.roles.find(role => role.name.toLowerCase() === roleNameToSearchFor.toLowerCase());

        if (role) {
            sendToChannel(message.channel, role.id);
        } else {
            sendToChannel(message.channel, 'No such role found');
        }
    }
});
