import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { TriggerEvent } from '../typings';
import { isInAllowedChannel, authorHasPermissionFlags, authorIsAdmin, authorHasRole } from './factory';

export const eventQueue = new RxQueue<TriggerEvent>();
eventQueue
    .pipe(
        filter(trigger => authorHasPermissionFlags(trigger.author, trigger.permissions.permissionFlags)),
        filter(trigger => isInAllowedChannel(trigger.message.channel, trigger.permissions.channels)),
        filter(trigger => authorHasRole(trigger.author, trigger.permissions.roles)),
        filter(trigger => authorIsAdmin(trigger.author, trigger.permissions.admins))
    )
    .subscribe(trigger => trigger.execute());
