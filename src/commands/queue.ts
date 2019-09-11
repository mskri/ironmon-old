import { RxQueue } from 'rx-queue';
import { map, filter } from 'rxjs/operators';
import { Action } from '../types';
import { isInAllowedChannel, authorHasPermissionFlags, authorHasRole, hasConfig } from './factory';
import { addCommandConfigToAction } from './helpers';
import configs from '../configs/trigger-permissions';

export const actionQueue = new RxQueue<Action>();
actionQueue
    .pipe(
        map(action => addCommandConfigToAction(configs, action)),
        filter(action => hasConfig(action.config)), // Ensure we have config available for the command
        filter(action => authorHasPermissionFlags(action.config!.permissionFlags, action.author)),
        filter(action => isInAllowedChannel(action.config!.channels, action.message.channel)),
        filter(action => authorHasRole(action.config!.roles, action.author))
    )
    .subscribe(action => action.execute());
