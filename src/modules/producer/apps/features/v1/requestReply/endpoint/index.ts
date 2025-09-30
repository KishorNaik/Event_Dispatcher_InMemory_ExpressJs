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
import { RequestReplyRequestDto, RequestReplyResponseDto } from '../contract';
import { getTraceId, logger } from '@/shared/utils/helpers/loggers';
import { RequestReplyEventDispatcherPublishService } from '../service';

@Route('api/v1/request-reply')
@Tags('Demo')
export class ProducerRequestReplyEndpoint extends Endpoint {
	private readonly _requestReplyEventDispatcherPublishService: RequestReplyEventDispatcherPublishService;
	public constructor() {
		super();
		this._requestReplyEventDispatcherPublishService = Container.get(
			RequestReplyEventDispatcherPublishService
		);
	}

	@Post()
	@Produces('application/json')
	@SuccessResponse(StatusCodes.OK, 'Ok') // Custom success response
	@Middlewares([
		ValidationMiddleware({
			body: RequestReplyRequestDto,
		}),
	])
	public async postAsync(
		@Request() req: express.Request,
		@Body() body: RequestReplyRequestDto
	): Promise<DataResponse<RequestReplyResponseDto>> {
		// Get TraceId
		const traceId = getTraceId();

		// Guard
		const guard = new GuardWrapper().check(req, 'request').check(body, 'body').validate();

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
		const publishResult = await this._requestReplyEventDispatcherPublishService.handleAsync({
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

		// Log Reply Response
		logger.info(`======= ✅ Reply: ${JSON.stringify(publishResult.value)} =======`);

		// Get Data
		const response: RequestReplyResponseDto = new RequestReplyResponseDto();
		response.message = `Message Received Successfully!`;

		return DataResponseFactory.success(
			StatusCodes.OK,
			response,
			`Message Received Successfully!`,
			undefined,
			traceId,
			undefined
		);
	}
}
