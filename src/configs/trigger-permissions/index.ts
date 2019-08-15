import ironbot from './ironbot';
import { TriggerPermissions } from '../../typings';

// TODO: Ideally these settings would be received from db and not from hardcoded json
const permissions: { [key: string]: TriggerPermissions[] } = {
    '369588869794103297': ironbot
};

export default permissions;
