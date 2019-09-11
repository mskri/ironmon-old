import { Message, TextChannel } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'role-id',
    help: {
        title: 'Get role ID',
        description: 'Returns ID for given role.',
        command: '!role-id',
        example: '!role-id <role name>'
    },
    trigger: /^!role-id/,
    execute: (message: Message) => {
        const roleNameToSearch = message.content.replace(/^![a-zA-Z-]+\b/, '').trim();
        const channel = <TextChannel>message.channel;
        const role = channel.guild.roles.find(
            role => role.name.toLowerCase() === roleNameToSearch.toLowerCase()
        );

        let result = 'No such role found';

        if (role) {
            result = `ID for role "${roleNameToSearch}" is ${role.id}`;
        }

        sendToChannel(message.channel, result);
    }
});
