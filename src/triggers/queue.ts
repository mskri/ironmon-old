import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { TriggerEvent } from '../typings';
import { isInAllowedChannel, authorHasPermissionFlags, authorHasRole } from './factory';

export const eventQueue = new RxQueue<TriggerEvent>();
eventQueue
    .pipe(
        filter(trigger => authorHasPermissionFlags(trigger.author, trigger.config.permissionFlags)),
        filter(trigger => isInAllowedChannel(trigger.message.channel, trigger.config.channels)),
        filter(trigger => authorHasRole(trigger.author, trigger.config.roles))
    )
    .subscribe(trigger => trigger.execute());
