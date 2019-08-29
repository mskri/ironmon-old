import { Message, Client, Collection, User } from 'discord.js';
import { OWNER_ID } from '../configs/env';

export const findOwner = (users: Collection<string, User>, ownerId: string | null): User =>
    users.find(user => user.id === ownerId);

export default function preventDM(client: Client, message: Message): boolean {
    const { channel, author } = message;
    const owner: User = findOwner(client.users, OWNER_ID);

    if (channel.type !== 'dm') return false;

    if (!owner) {
        console.error(
            `Owner ID (${OWNER_ID}) does not match any user the bot can interact with. Check that your .env file has your ID set up properly`
        );
        return true;
    }

    const { username, discriminator } = author;
    owner.send(`_${username}#${discriminator} sent me a dm:_ \`\`\`${message.content}\`\`\``);
    console.log(`${username}#${discriminator} sent dm: ${message.content}`);

    return true;
}
