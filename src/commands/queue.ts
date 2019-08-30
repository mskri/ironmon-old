import { RxQueue } from 'rx-queue';
import { map, filter } from 'rxjs/operators';
import { Action } from '../typings';
import { isInAllowedChannel, authorHasPermissionFlags, authorHasRole, hasConfig } from './factory';
import { addCommandConfigToAction } from './helpers';
import configs from '../configs/trigger-permissions';

export const actionQueue = new RxQueue<Action>();
actionQueue
    .pipe(
        map(action => addCommandConfigToAction(configs, action)),
        filter(action => hasConfig(action.config)),
        filter(action => authorHasPermissionFlags(action.author, action.config!.permissionFlags)),
        filter(action => isInAllowedChannel(action.message.channel, action.config!.channels)),
        filter(action => authorHasRole(action.author, action.config!.roles))
    )
    .subscribe(action => action.execute());
