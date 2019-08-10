import { RxQueue } from 'rx-queue';
import { filter, map } from 'rxjs/operators';
import { MessageTriggerEvent, ReactionTriggerEvent } from '../typings';

// Note: should match MESSAGE_REACTION_ADD or MESSAGE_REACTION_REMOVE from discord.js
// if discord.js changes that they should be changed to reflect the new ones here too.
export const allowedReactionEvents = {
    MESSAGE_REACTION_ADD: 'MESSAGE_REACTION_ADD',
    MESSAGE_REACTION_REMOVE: 'MESSAGE_REACTION_REMOVE'
};

export const messageTriggerQueue = new RxQueue<MessageTriggerEvent>();
messageTriggerQueue
    .pipe(
        map(trigger => {
            trigger.logInit();
            return trigger;
        }),
        filter(trigger => trigger.isConfigured()),
        filter(trigger => trigger.authorHasPermissionFlags()),
        filter(trigger => trigger.isAllowedChannel()),
        filter(trigger => trigger.authorHasPermission())
    )
    .subscribe(trigger => {
        trigger.execute();
    });

export const reactionTriggerQueue = new RxQueue<ReactionTriggerEvent>();
reactionTriggerQueue
    .pipe(
        map(trigger => {
            trigger.logInit();
            return trigger;
        }),
        filter(trigger => trigger.isConfigured()),
        filter(trigger => trigger.authorHasPermissionFlags()),
        filter(trigger => trigger.isAllowedChannel()),
        filter(trigger => trigger.authorHasPermission())
    )
    .subscribe(trigger => {
        switch (trigger.getType()) {
            case allowedReactionEvents.MESSAGE_REACTION_ADD:
                trigger.onAddReaction();
                break;
            case allowedReactionEvents.MESSAGE_REACTION_REMOVE:
                trigger.onRemoveReaction();
                break;
        }
    });
