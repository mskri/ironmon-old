import eventSignup from './attendance/event-signup';
import deleteMessage from './generic/delete-message';

import getChannelId from './generic/get-channel-id';
import getEmojiId from './generic/get-emoji-id';
import sayHello from './generic/say-hello';
import getRoleId from './generic/get-role-id';

import addEvent from './attendance/add-event';

import panic from './admin/panic';

export const reactions = [eventSignup, deleteMessage];
export const commands = [getChannelId, getEmojiId, getRoleId, addEvent, panic, sayHello];

export default [...commands, ...reactions];
