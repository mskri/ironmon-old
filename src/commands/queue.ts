import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { Action } from '../typings';
import { isInAllowedChannel, authorHasPermissionFlags, authorHasRole } from './factory';

export const actionQueue = new RxQueue<Action>();
actionQueue
    .pipe(
        filter(action => authorHasPermissionFlags(action.author, action.config.permissionFlags)),
        filter(action => isInAllowedChannel(action.message.channel, action.config.channels)),
        filter(action => authorHasRole(action.author, action.config.roles))
    )
    .subscribe(action => action.execute());
