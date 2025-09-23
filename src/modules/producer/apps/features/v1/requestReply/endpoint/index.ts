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
import { DataResponse, StatusCodes } from '@kishornaik/utils';
import { ValidationMiddleware } from '@/middlewares/security/validations';
import { Endpoint } from '@/shared/utils/helpers/tsoa';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { RequestReplyRequestDto, RequestReplyResponseDto } from '../contract';
import { RequestReplyCommand } from '../command';

@Route('api/v1/request-reply')
@Tags('Demo')
export class ProducerRequestReplyEndpoint extends Endpoint {
	@Post()
	@Produces('application/json')
	@SuccessResponse(StatusCodes.OK, 'Ok') // Custom success response
	@Middlewares([ValidationMiddleware(RequestReplyRequestDto)])
	public async postAsync(
		@Request() req: express.Request,
		@Body() body: RequestReplyRequestDto
	): Promise<DataResponse<RequestReplyResponseDto>> {
		this.setStatus(StatusCodes.OK); // set return status 201
    const response=await mediator.send(new RequestReplyCommand(body))
    return response;
	}
}
