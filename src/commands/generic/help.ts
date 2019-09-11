import { TextChannel, DMChannel, GroupDMChannel, Message, RichEmbed } from 'discord.js';
import { Command } from '../../types';
import { createCommand } from '../factory';
import { getCommandArguments, sendToChannel } from '../helpers';
import { getCommandsWithHelp, getCommandByName } from '../index';

export default createCommand({
    type: 'MESSAGE',
    name: 'help',
    help: {
        title: 'Show help for availableCommands',
        description: 'Show help',
        command: '!help',
        example: '!help OR !help <command>'
    },
    trigger: /^!help/,
    execute: (message: Message) => {
        // Sets the first argument received in the message that triggers this command
        const [commandName] = getCommandArguments(message.content);

        if (commandName) {
            const command = getCommandByName(commandName, true);

            if (!command || !command.help) {
                sendToChannel(message.channel, 'No matching command not found. Try `!help`?');
                return;
            }

            replyHelpForSpecifiedCommand(message.channel, command);
            return;
        }

        const commandsWithHelp = getCommandsWithHelp();
        replyHelpForAllCommands(message.channel, commandsWithHelp);
    }
});

const wrapInCodeBlock = (code: string): string => '```\n' + code + '\n```';

const replyHelpForSpecifiedCommand = (channel: TextChannel | DMChannel | GroupDMChannel, command: Command): void => {
    // If the command doesn't have help data there's nothing to show
    if (!command || !command.help) {
        sendToChannel(channel, 'No matching command not found. Try `!help`?');
        return;
    }

    const { help } = command;
    const exampleCommand = help.example || help.command;

    const embed = new RichEmbed({
        color: 0x0099ff,
        title: help.title,
        description: `${help.description}\n${wrapInCodeBlock(exampleCommand)}`
    });

    sendToChannel(channel, embed);
};

const formatCommandHelpToEmbedFields = (
    commandsWithHelp: Command[]
): { name: string; value: string; inline?: boolean }[] => {
    return commandsWithHelp.map(command => ({
        name: command.help!.title,
        value: wrapInCodeBlock(command.help!.command),
        inline: true
    }));
};

const replyHelpForAllCommands = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    commandsWithHelp: Command[]
): void => {
    const embed = new RichEmbed({
        color: 0x0099ff,
        title: 'Available commands',
        description:
            'Below you can see all the available commands. Use `!help <command>` to get details for specific one.',
        fields: formatCommandHelpToEmbedFields(commandsWithHelp)
    });

    sendToChannel(channel, embed);
};
