import { Command } from '../typings';

// Reaction listeners
import eventSignup from './attendance/event-signup';
import deleteMessage from './generic/delete-message';

// Commands
import help from './generic/help';
import channelId from './generic/get-channel-id';
import emojiId from './generic/get-emoji-id';
import roleId from './generic/get-role-id';
import addEvent from './attendance/add-event';
import panic from './admin/panic';

// Word triggers
import hello from './generic/say-hello';

export const reactions: Command[] = [eventSignup, deleteMessage];
export const commands: Command[] = [help, channelId, emojiId, roleId, addEvent, panic];
export const wordTriggers: Command[] = [hello];
export const allCommands: Command[] = [...commands, ...reactions, ...wordTriggers];

export default allCommands;

export const getCommandsWithHelp = (): Command[] => allCommands.filter(command => command.help);

export const getCommandByName = (commandName: string, helpRequired: boolean = false): Command | undefined => {
    if (helpRequired) {
        return getCommandsWithHelp().find(command => command.name === commandName);
    }

    return allCommands.find(command => command.name === commandName);
};
