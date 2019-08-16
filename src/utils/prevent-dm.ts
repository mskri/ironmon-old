import { Message, Client } from 'discord.js';
import { OWNER_ID } from '../configs/env';

export default function preventDM(client: Client, message: Message): boolean {
    if (message.channel.type == 'dm') {
        const { username, discriminator } = message.author;
        const owner = client.users.find(user => user.id === OWNER_ID);

        if (!owner) {
            console.error(
                `Owner ID (${OWNER_ID}) does not match any user the bot can interact with. Check that your .env file has your ID set up properly`
            );
            return true;
        }

        owner.send(`_${username}#${discriminator} sent me a dm:_ \`\`\`${message.content}\`\`\``);
        console.log(`${username}#${discriminator} sent dm: ${message.content}`);

        return true;
    }

    return false;
}
