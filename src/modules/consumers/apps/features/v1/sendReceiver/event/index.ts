import { eventDispatcher } from '@/shared/utils/helpers/eventDispatcher';
import {
	JsonString,
	SendReceiverConsumerEventDispatcher,
	WorkerEventDispatcher,
} from '@kishornaik/utils';
import { SenderReceiverRequestDto } from '../contract';
import { logger } from '@/shared/utils/helpers/loggers';

// #region Setup SendReceiver Consumer Event Dispatcher
const eventName = 'sendReceiver-demo';
const sendReceiverConsumerEventDispatcher = new SendReceiverConsumerEventDispatcher(
	eventDispatcher
);
// #endregion

// #region Subscriber Event
export const sendReceiverConsumerEventSubscriberListener: WorkerEventDispatcher = async () => {
	logger.info(`======= ✅ Subscribed to event: ${eventName} =======`);

	// Subscribe
	await sendReceiverConsumerEventDispatcher.subscribe<JsonString>(eventName, async (message) => {
		// Get Payload
		const { correlationId, data, traceId, timestamp } = message;
		logger.info(`======= ✅ Event: ${eventName} =======`);
		logger.info(`======= ✅ CorrelationId: ${correlationId} =======`);
		logger.info(`======= ✅ TraceId: ${traceId} =======`);
		logger.info(`======= ✅ Timestamp: ${timestamp} =======`);

		// Get Data
		const request: SenderReceiverRequestDto = JSON.parse(
			data as JsonString
		) as SenderReceiverRequestDto;

		// Process
		// ...

		// Log Data
		logger.info(`======= ✅ Request: ${JSON.stringify(request)} =======`);
	});
};
// #endregion
