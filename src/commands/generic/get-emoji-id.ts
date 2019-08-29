import { Message, TextChannel } from 'discord.js';
import { sendToChannel } from '../helpers';
import { createCommand } from '../factory';

export default createCommand({
    type: 'MESSAGE',
    name: 'getEmojiId',
    trigger: /^!emoji-id/,
    execute: (message: Message) => {
        const emojiNameToSearch: string = message.content.replace(/^![a-zA-Z-]+\b/, '').trim();
        const channel = <TextChannel>message.channel;
        const emoji = channel.guild.emojis.find(emoji => emoji.name === emojiNameToSearch);

        let result = 'No such emoji found';

        if (emoji) {
            result = `ID for "${emojiNameToSearch}" emoji is ${emoji.id}`;
        }

        sendToChannel(message.channel, result);
    }
});