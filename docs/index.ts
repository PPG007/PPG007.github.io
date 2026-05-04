import { GroupConfigs } from '@doc-types';
import frontend from './frontend';
import java from './java';
import golang from './golang';
import python from './python';
import php from './php';
import cloud from './cloud';
import databse from './database';
import others from './others';

const configs: GroupConfigs = [frontend, java, golang, python, php, cloud, databse, others];

export default configs;
