import ironbot from './ironbot';
import { TriggerConfig } from '../../typings';

// TODO: Ideally these settings would be received from db and not from hardcoded json
const configs: { [key: string]: TriggerConfig[] } = {
    '369588869794103297': ironbot
};

export default configs;
