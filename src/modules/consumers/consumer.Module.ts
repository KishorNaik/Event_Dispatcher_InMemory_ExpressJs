import { WorkerEventDispatcher } from '@kishornaik/utils';
import { sendReceiverConsumerEventSubscriberListener } from './apps/features/v1/sendReceiver';
import { requestReplyConsumerEventSubscriberListener } from './apps/features/v1/requestReply';

const consumerEventDispatcherModules: WorkerEventDispatcher[] = [
	sendReceiverConsumerEventSubscriberListener,
	requestReplyConsumerEventSubscriberListener,
];
export { consumerEventDispatcherModules };
