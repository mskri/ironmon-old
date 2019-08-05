import { Client, Message, Guild } from 'discord.js';
import { AUTH_TOKEN } from './src/configs/bot';
import * as bot from './src/bot';

const client = new Client({
    disabledEvents: ['PRESENCE_UPDATE', 'TYPING_START', 'VOICE_STATE_UPDATE', 'VOICE_SERVER_UPDATE']
});

client.on('guildCreate', (guild: Guild) => bot.onGuildCreate(guild));
client.on('guildDelete', (guild: Guild) => bot.onGuildDelete(guild));
client.on('error', (error: Error) => bot.onError(error));
client.on('ready', () => bot.onReady(client));
client.on('message', (message: Message) => bot.onMessage(client, message));
client.on('raw', async (event: any) => bot.onRaw(client, event));

client.login(AUTH_TOKEN);
