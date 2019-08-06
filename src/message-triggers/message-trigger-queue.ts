import { RxQueue } from 'rx-queue';
import { filter, map } from 'rxjs/operators';
import { MessageTriggerEvent } from '../typings';

// TODO: Figure a better way to include all the triggers rather than needing to import all of them one-by-one?
import getChannelId from './generic/get-channel-id';
import getEmojiId from './generic/get-emoji-id';
import sayHello from './generic/say-hello';
import getRoleId from './generic/get-role-id';
import panic from './system/panic';

export const availableMessageTriggers = [getChannelId, getEmojiId, sayHello, getRoleId, panic];

export const messageTriggerQueue = new RxQueue<MessageTriggerEvent>();
messageTriggerQueue
    .pipe(
        map(trigger => {
            trigger.logInit();
            return trigger;
        }),
        filter(trigger => trigger.isConfigured()),
        filter(trigger => trigger.isAllowedChannel()),
        filter(trigger => trigger.authorHasPermission())
    )
    .subscribe(trigger => {
        trigger.execute();
    });

// export default messageTriggerQueue;
