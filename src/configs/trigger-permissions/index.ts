import ironbot from './ironbot';
import ironwood from './ironwood';
import { CommandConfig } from '../../typings';

// TODO: Ideally these settings would be received from db and not from hardcoded json
const configs: { [key: string]: CommandConfig[] } = {
    '369588869794103297': ironbot,
    '352889929212100619': ironwood
};

export default configs;
