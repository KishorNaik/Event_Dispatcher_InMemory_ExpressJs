import { DataResponse, DataResponseFactory, ExceptionsWrapper, GuardWrapper, JsonString, RequestData, RequestHandler, requestHandler, sealed, SendReceiverMessageEventDispatcher, SendReceiverProducerEventDispatcher, StatusCodes } from "@kishornaik/utils";
import { SenderReceiverRequestDto, SenderReceiverResponseDto } from "../contract";
import { TraceIdWrapper } from "@/shared/utils/helpers/traceId";
import { getTraceId } from "@/shared/utils/helpers/loggers";
import { eventDispatcher } from "@/shared/utils/helpers/eventDispatcher";

// #region SetUp Event Dispatcher
const eventName="sendReceiver-demo";
const sendReceiverProducerEventDispatcher=new SendReceiverProducerEventDispatcher(eventDispatcher);
// #endregion

// #region Command
@sealed
export class SendReceiverCommand extends RequestData<DataResponse<SenderReceiverResponseDto>> {
  private readonly _request:SenderReceiverRequestDto;

  public constructor(request:SenderReceiverRequestDto) {
    super();
    this._request = request;
  }

  public get request():SenderReceiverRequestDto {
    return this._request;
  }
}
// #endregion

// #region Command Handler
@sealed
@requestHandler(SendReceiverCommand)
export class SendReceiverCommandHandler implements RequestHandler<SendReceiverCommand, DataResponse<SenderReceiverResponseDto>> {
  public async handle(value: SendReceiverCommand): Promise<DataResponse<SenderReceiverResponseDto>> {
    return await ExceptionsWrapper.tryCatchPipelineAsync(async ()=>{

      // Get traceId
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
      const requestJson:JsonString=JSON.stringify(request as SenderReceiverRequestDto) as JsonString;

      // Prepare Message Payload
      const messageRequest:SendReceiverMessageEventDispatcher<JsonString>={
        data:requestJson,
        traceId:traceId,
        correlationId:crypto.randomUUID().toString(),
        timestamp:new Date().toISOString()
      }

      // Send Message
      await sendReceiverProducerEventDispatcher.sendAsync<JsonString>(eventName,messageRequest);

      // Response
      const response:SenderReceiverResponseDto=new SenderReceiverResponseDto();
      response.message="Successfully sent";

      return DataResponseFactory.success(StatusCodes.OK,response,`Successfully sent`,undefined,traceId,undefined);

    });
  }

}
// #endregion
