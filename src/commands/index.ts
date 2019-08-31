import { Command } from '../typings';

// Reaction listeners
import eventSignup from './attendance/event-signup';
import deleteMessage from './generic/delete-message';

// Commands and word triggers
import help from './generic/help';
import channelId from './generic/get-channel-id';
import emojiId from './generic/get-emoji-id';
import hello from './generic/say-hello';
import roleId from './generic/get-role-id';
import addEvent from './attendance/add-event';
import panic from './admin/panic';

export const reactions: Command[] = [eventSignup, deleteMessage];
export const triggers: Command[] = [help, channelId, emojiId, roleId, addEvent, panic, hello];
export const allCommands: Command[] = [...triggers, ...reactions];

export default allCommands;

export const getCommandsWithHelp = (): Command[] => allCommands.filter(command => command.help);

export const getCommandByName = (commandName: string, helpRequired: boolean = false): Command | undefined => {
    if (helpRequired) {
        return getCommandsWithHelp().find(command => command.name === commandName);
    }

    return allCommands.find(command => command.name === commandName);
};
