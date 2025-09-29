import { eventDispatcher } from '@/shared/utils/helpers/eventDispatcher';
import {
	ExceptionsWrapper,
	GuardWrapper,
	IServiceHandlerVoidAsync,
	JsonString,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	SendReceiverMessageEventDispatcher,
	SendReceiverProducerEventDispatcher,
	Service,
	VOID_RESULT,
	VoidResult,
} from '@kishornaik/utils';
import { SenderReceiverRequestDto } from '../contract';

// #region SetUp Event Dispatcher
const eventName = 'sendReceiver-demo';
const sendReceiverProducerEventDispatcher = new SendReceiverProducerEventDispatcher(
	eventDispatcher
);
// #endregion

// #region Service
export interface ISendReceiverEventDispatcherPublishServiceParameters {
	request: SenderReceiverRequestDto;
	traceId: string;
}

export interface ISendReceiverEventDispatcherPublishService
	extends IServiceHandlerVoidAsync<ISendReceiverEventDispatcherPublishServiceParameters> {}

@sealed
@Service()
export class SendReceiverEventDispatcherPublishService
	implements ISendReceiverEventDispatcherPublishService
{
	public async handleAsync(
		params: ISendReceiverEventDispatcherPublishServiceParameters
	): Promise<Result<VoidResult, ResultError>> {
		return await ExceptionsWrapper.tryCatchResultAsync(async () => {
			// Guard
			const guard = new GuardWrapper()
				.check(params, 'params')
				.check(params.request, 'request')
				.check(params.traceId, 'traceId')
				.validate();

			if (guard.isErr())
				return ResultFactory.error(guard.error.statusCode, guard.error.message);

			const { request, traceId } = params;

			const requestJson: JsonString = JSON.stringify(
				request as SenderReceiverRequestDto
			) as JsonString;

			// Prepare Message Payload
			const messageRequest: SendReceiverMessageEventDispatcher<JsonString> = {
				data: requestJson,
				traceId: traceId,
				correlationId: crypto.randomUUID().toString(),
				timestamp: new Date().toISOString(),
			};

			// Send Message
			await sendReceiverProducerEventDispatcher.sendAsync<JsonString>(
				eventName,
				messageRequest
			);

			// Response
			return ResultFactory.success(VOID_RESULT);
		});
	}
}
// #endregion
