import { eventDispatcher } from '@/shared/utils/helpers/eventDispatcher';
import {
	JsonString,
	ReplyMessageEventDispatcher,
	RequestReplyConsumerEventDispatcher,
	StatusCodes,
	WorkerEventDispatcher,
} from '@kishornaik/utils';
import { logger } from '@/shared/utils/helpers/loggers';
import { RequestReplyRequestDto } from '../contract';

// #region Setup Request Reply Consumer Event Dispatcher
const eventName = 'requestReply-demo';
const requestReplyConsumerEventDispatcher = new RequestReplyConsumerEventDispatcher(
	eventDispatcher
);
// #endregion

// #region Subscriber Event
export const requestReplyConsumerEventSubscriberListener: WorkerEventDispatcher = async () => {
	logger.info(`======= ✅ Subscribed to event: ${eventName} =======`);

	// Subscribe
	await requestReplyConsumerEventDispatcher.startConsumingAsync<JsonString, JsonString>(
		eventName,
		async (message) => {
			// Get Payload
			const { correlationId, data, traceId, timestamp } = message;
			logger.info(`======= ✅ Event: ${eventName} =======`);
			logger.info(`======= ✅ CorrelationId: ${correlationId} =======`);
			logger.info(`======= ✅ TraceId: ${traceId} =======`);
			logger.info(`======= ✅ Timestamp: ${timestamp} =======`);

			// Get Data
			const request: RequestReplyRequestDto = JSON.parse(
				data as JsonString
			) as RequestReplyRequestDto;
			// Log Data
			logger.info(`======= ✅ Request: ${JSON.stringify(request)} =======`);

			// Process
			// ...

			// Reply
			const messageReply: ReplyMessageEventDispatcher<JsonString> = {
				data: JSON.stringify({
					message: `Hello World from ${request.fullName}`,
				}) as JsonString,
				traceId: traceId,
				correlationId: correlationId,
				timestamp: new Date().toISOString(),
				success: true,
				message: `Reply from Consumer`,
				statusCode: StatusCodes.OK,
			};

			return messageReply;
		}
	);
};
// #endregion
