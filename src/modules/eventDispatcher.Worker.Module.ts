import { WorkerEventDispatcher } from '@kishornaik/utils';
import { consumerEventDispatcherModules } from './consumers/consumer.Module';

// Workers
const eventDispatcherWorkerModules: WorkerEventDispatcher[] = [...consumerEventDispatcherModules];

export { eventDispatcherWorkerModules };
