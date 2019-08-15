import { Message, TextChannel } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    name: 'getEmojiId',
    trigger: /^!emoji-id/,
    execute: (message: Message) => {
        const reactionNameToSearchFor: string = message.content.replace(/^!\w+\s/, '');
        const channel = <TextChannel>message.channel;
        const emoji = channel.guild.emojis.find(emoji => emoji.name === reactionNameToSearchFor);

        let reply = 'No such emoji found';

        if (emoji) {
            reply = emoji.id;
        }

        sendToChannel(message.channel, reply);
    }
});
