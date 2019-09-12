import { RxQueue } from 'rx-queue';
import { filter } from 'rxjs/operators';
import { Action } from '../types';
import { isInAllowedChannel, authorHasPermissionFlags, authorHasRole, hasConfig } from './factory';

export const actionQueue = new RxQueue<Action>();
actionQueue
    .pipe(
        filter(action => hasConfig(action.config)),
        filter(action => authorHasPermissionFlags(action.config!.permissionFlags, action.author)),
        filter(action => isInAllowedChannel(action.config!.channels, action.message.channel)),
        filter(action => authorHasRole(action.config!.roles, action.author))
    )
    .subscribe(action => action.execute());
