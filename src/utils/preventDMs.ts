import { Message, Client } from 'discord.js';

export default function preventDMs(client: Client, message: Message): boolean {
    if (message.channel.type == 'dm') {
        const { username, discriminator } = message.author;
        const owner = client.users.find(user => user.id === '302469039978971156'); // Saple

        owner.send(`_${username}#${discriminator} send me a dm:_\n${message.content}`);
        console.log(`${username}#${discriminator} send dm: ${message.content}`);

        return true;
    }

    return false;
}
