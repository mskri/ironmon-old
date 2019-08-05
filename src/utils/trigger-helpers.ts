import { Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { DiscordUser } from '../typings';

export const matchesTrigger = (trigger: RegExp, message: string): boolean => {
    return trigger instanceof RegExp ? trigger.test(message) : false;
};

export const matchesReaction = (reactions: string[], emojiId: string): boolean => {
    return reactions.includes(emojiId);
};

export const sendToChannel = (channel: TextChannel | DMChannel | GroupDMChannel, reply: string): void => {
    channel.send(reply).catch(error => console.error(error));
};

export const getDiscordUser = (message: Message): DiscordUser => {
    const author = message.author;
    const member = message.guild.members.find(member => member.id === author.id);

    if (!member) {
        console.error(`Could not find member in guild with ID (${author.id})`);
        return;
    }

    const username = member.nickname ? member.nickname : member.user.username;

    return {
        id: member.user.id,
        username: username,
        discriminator: member.user.discriminator,
        full: `${username} (${member.user.username}#${member.user.discriminator}/${author.id})`,
        ping: `<@${member.user.id}>`
    };
};

export const getAuthorRolesArray = (message: Message): string[] => {
    return Array.from(message.member.roles.keys());
};
