import {
	Body,
	Get,
	Path,
	Post,
	Produces,
	Query,
	Route,
	SuccessResponse,
	Tags,
	Request,
	Middlewares,
} from 'tsoa';
import express from 'express';
import {
	Container,
	DataResponse,
	DataResponseFactory,
	GuardWrapper,
	StatusCodes,
} from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { SenderReceiverRequestDto, SenderReceiverResponseDto } from '../contract';
import { getTraceId } from '@/shared/utils/helpers/loggers';
import { SendReceiverEventDispatcherPublishService } from '../service';

@Route('api/v1/send-receiver')
@Tags('Demo')
export class ProducerSendReceiverEndpoint extends Endpoint {
	private readonly _sendReceiverEventDispatcherPublishService: SendReceiverEventDispatcherPublishService;

	public constructor() {
		super();
		this._sendReceiverEventDispatcherPublishService = Container.get(
			SendReceiverEventDispatcherPublishService
		);
	}

	@Post()
	@Produces('application/json')
	@SuccessResponse(StatusCodes.OK, 'Ok') // Custom success response
	@Middlewares([
		ValidationMiddleware({
			body: SenderReceiverRequestDto,
		}),
	])
	public async postAsync(
		@Request() req: express.Request,
		@Body() body: SenderReceiverRequestDto
	): Promise<DataResponse<SenderReceiverResponseDto>> {
		// Get traceId
		const traceId = getTraceId();

		// Guard
		const guard = new GuardWrapper().check(body, 'body').check(req, 'request').validate();

		if (guard.isErr()) {
			this.setStatus(guard.error.statusCode);
			return DataResponseFactory.error(
				StatusCodes.BAD_REQUEST,
				guard.error.message,
				undefined,
				traceId,
				undefined
			);
		}

		// Publish Event
		const publishResult = await this._sendReceiverEventDispatcherPublishService.handleAsync({
			request: body,
			traceId: traceId,
		});
		if (publishResult.isErr()) {
			this.setStatus(publishResult.error.statusCode);
			return DataResponseFactory.error(
				publishResult.error.statusCode,
				publishResult.error.message,
				undefined,
				traceId,
				undefined
			);
		}

		// Response
		const response: SenderReceiverResponseDto = new SenderReceiverResponseDto();
		response.message = 'Successfully sent';

		return DataResponseFactory.success(
			StatusCodes.OK,
			response,
			`sent`,
			undefined,
			traceId,
			undefined
		);
	}
}
