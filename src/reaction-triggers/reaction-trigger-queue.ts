import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { ReactionTriggerEvent } from '../typings';

import smile from './signup-system/smile';
import eventSignup from './signup-system/event-signup';

// Note: should match MESSAGE_REACTION_ADD or MESSAGE_REACTION_REMOVE from discord.js
// if discord.js changes that they should be changed to reflect the new ones here too.
export const allowedReactionEvents = {
    MESSAGE_REACTION_ADD: 'MESSAGE_REACTION_ADD',
    MESSAGE_REACTION_REMOVE: 'MESSAGE_REACTION_REMOVE'
};

export const availableReactionTriggers = [smile, eventSignup];

export const reactionTriggerQueue = new RxQueue<ReactionTriggerEvent>();
reactionTriggerQueue
    .pipe(
        filter(trigger => trigger.isConfigured()),
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

// export default reactionTriggerQueue;
