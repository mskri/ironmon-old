import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { TriggerEvent } from '../typings';

export const eventQueue = new RxQueue<TriggerEvent>();
eventQueue
    .pipe(
        filter(trigger => trigger.authorHasPermissionFlags()),
        filter(trigger => trigger.isInAllowedChannel()),
        filter(trigger => trigger.authorHasRole())
    )
    .subscribe(trigger => trigger.execute());
