import { eventDispatcher } from "@/shared/utils/helpers/eventDispatcher";
import { DataResponse, DataResponseFactory, ExceptionsWrapper, GuardWrapper, JsonString, ReplyMessageEventDispatcher, RequestData, RequestHandler, requestHandler, RequestReplyMessageEventDispatcher, RequestReplyProducerEventDispatcher, sealed, StatusCodes } from "@kishornaik/utils";
import { RequestReplyRequestDto, RequestReplyResponseDto } from "../contract";
import { getTraceId, logger } from "@/shared/utils/helpers/loggers";

// #region Setup Request Reply Producer Event Dispatcher
const eventName="requestReply-demo";
const requestReplyProducerEventDispatcher=new RequestReplyProducerEventDispatcher(eventDispatcher);
// #endregion

// #region Command
@sealed
export class RequestReplyCommand extends RequestData<DataResponse<RequestReplyResponseDto>>{
  private readonly _request:RequestReplyRequestDto;

  public constructor(request:RequestReplyRequestDto) {
    super();
    this._request = request;
  }

  public get request():RequestReplyRequestDto {
    return this._request;
  }
}

// #endregion

// #region Command Handler
@sealed
@requestHandler(RequestReplyCommand)
export class RequestCommandHandler implements RequestHandler<RequestReplyCommand,DataResponse<RequestReplyResponseDto>>{
  public async handle(value: RequestReplyCommand): Promise<DataResponse<RequestReplyResponseDto>> {
    return await ExceptionsWrapper.tryCatchPipelineAsync(async ()=>{

      // Get TraceId
      const traceId=getTraceId();

      // Guard
      const guard=new GuardWrapper()
        .check(value,"value")
        .check(value.request,"request")
        .validate();

      if(guard.isErr())
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,guard.error.message,undefined,traceId,undefined);

      // Convert data into JSON
      const {request}=value;
      const requestJson:JsonString=JSON.stringify(request as RequestReplyRequestDto) as JsonString;

      // Prepare Message Payload
      const messageRequest:RequestReplyMessageEventDispatcher<JsonString>={
        data:requestJson,
        traceId:traceId,
        correlationId:crypto.randomUUID().toString(),
        timestamp:new Date().toISOString()
      }

      // send message
      const reply:ReplyMessageEventDispatcher<JsonString>=await requestReplyProducerEventDispatcher.sendAsync<JsonString,JsonString>(eventName,messageRequest);
      if(!reply.success)
        return DataResponseFactory.error(reply.statusCode,reply.error,undefined,traceId,undefined);

      // Log Reply Response
      logger.info(`======= ✅ Reply: ${JSON.stringify(reply)} =======`);

      // Get Data
      const response:RequestReplyResponseDto=new RequestReplyResponseDto();
      response.message=`Message Received Successfully!`;

      return DataResponseFactory.success(StatusCodes.OK,response,`Message Received Successfully!`,undefined,traceId,undefined);
    });
  }

}

// #endregion
