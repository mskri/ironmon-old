import { Message, Client, User } from 'discord.js';

const { OWNER_DISCORD_ID } = process.env;

export default function preventDM(client: Client, message: Message): boolean {
    const { channel, author } = message;
    const owner: User = client.users.find(user => user.id === OWNER_DISCORD_ID);

    if (channel.type !== 'dm') return false;

    if (!owner) {
        console.error(
            `Owner ID (${OWNER_DISCORD_ID}) does not match any user the bot can interact with. Check that your .env file has your ID set up properly`
        );
        return true;
    }

    const { username, discriminator } = author;
    owner.send(`_${username}#${discriminator} sent me a dm:_ \`\`\`${message.content}\`\`\``);
    console.log(`${username}#${discriminator} sent dm: ${message.content}`);

    return true;
}
