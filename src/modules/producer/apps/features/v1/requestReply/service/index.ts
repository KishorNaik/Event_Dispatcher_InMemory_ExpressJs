import { eventDispatcher } from '@/shared/utils/helpers/eventDispatcher';
import {
	ExceptionsWrapper,
	GuardWrapper,
	IServiceHandlerAsync,
	JsonString,
	ReplyMessageEventDispatcher,
	RequestReplyMessageEventDispatcher,
	RequestReplyProducerEventDispatcher,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
} from '@kishornaik/utils';
import { RequestReplyRequestDto } from '../contract';

// #region Setup Request Reply Producer Event Dispatcher
const eventName = 'requestReply-demo';
const requestReplyProducerEventDispatcher = new RequestReplyProducerEventDispatcher(
	eventDispatcher
);
// #endregion

// #region service

export interface IRequestReplyEventDispatcherPublishServiceParameters {
	request: RequestReplyRequestDto;
	traceId: string;
}

export interface IRequestReplyEventDispatcherPublishServiceResult {
	message: string;
}

export interface IRequestReplyEventDispatcherPublishService
	extends IServiceHandlerAsync<
		IRequestReplyEventDispatcherPublishServiceParameters,
		IRequestReplyEventDispatcherPublishServiceResult
	> {}

@sealed
@Service()
export class RequestReplyEventDispatcherPublishService
	implements IRequestReplyEventDispatcherPublishService
{
	public async handleAsync(
		params: IRequestReplyEventDispatcherPublishServiceParameters
	): Promise<Result<IRequestReplyEventDispatcherPublishServiceResult, ResultError>> {
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
				request as RequestReplyRequestDto
			) as JsonString;

			// Prepare Message Payload
			const messageRequest: RequestReplyMessageEventDispatcher<JsonString> = {
				data: requestJson,
				traceId: traceId,
				correlationId: crypto.randomUUID().toString(),
				timestamp: new Date().toISOString(),
			};

			// send message
			const reply: ReplyMessageEventDispatcher<JsonString> =
				await requestReplyProducerEventDispatcher.sendAsync<JsonString, JsonString>(
					eventName,
					messageRequest
				);
			if (!reply.success) return ResultFactory.error(reply.statusCode, reply.error);

			const response: IRequestReplyEventDispatcherPublishServiceResult = JSON.parse(
				reply.data as JsonString
			) as IRequestReplyEventDispatcherPublishServiceResult;
			return ResultFactory.success(response);
		});
	}
}
// #endregion
