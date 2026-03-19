import { GroupConfigs } from '@doc-types';
import frontend from './frontend';
import java from './java';
import golang from './golang';
import php from './php';
import cloud from './cloud';
import databse from './database';
import others from './others';

const configs: GroupConfigs = [frontend, java, golang, php, cloud, databse, others];

export default configs;
