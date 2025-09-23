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
import { SenderReceiverRequestDto, SenderReceiverResponseDto } from '../contract';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { SendReceiverCommand } from '../command';

@Route('api/v1/send-receiver')
@Tags('Demo')
export class ProducerSendReceiverEndpoint extends Endpoint {
	@Post()
	@Produces('application/json')
	@SuccessResponse(StatusCodes.OK, 'Ok') // Custom success response
	@Middlewares([ValidationMiddleware(SenderReceiverRequestDto)])
	public async postAsync(
		@Request() req: express.Request,
		@Body() body: SenderReceiverRequestDto
	): Promise<DataResponse<SenderReceiverResponseDto>> {
		this.setStatus(StatusCodes.OK); // set return status 201
    const response=await mediator.send(new SendReceiverCommand(body))
    return response;
	}
}
