import { EventEmitter } from "tseep";
import {
  type FailureCompletedProcessParam,
  type SuccessCompletedProcessParam,
  type TimeoutCompletedProcessParam,
  failureCompletedProcessEvent,
  successCompletedProcessEvent,
  timeoutCompletedProcessEvent,
} from "./completed";
import { connectionErrorEvent, errorEvent, unknownErrorEvent } from "./error";
import {
  type FetchProcessParam,
  type WaitingProcessParam,
  fetchProcessEvent,
  timerWaitingProcessEvent,
} from "./processing";

export const emitter = new EventEmitter<{
  // errors
  error: (error: Error) => void;
  connectionError: (error: Error) => void;
  unknownError: (error: Error) => void;

  // processing
  fetchProcess: ({ session, content }: FetchProcessParam) => void;
  timerWaitingProcess: ({ waitingTime }: WaitingProcessParam) => void;

  // completed
  successCompletedProcess: ({ id }: SuccessCompletedProcessParam) => void;
  failureCompletedProcess: ({
    id,
    error,
  }: FailureCompletedProcessParam) => void;
  timeoutCompletedProcess: ({ id }: TimeoutCompletedProcessParam) => void;
}>();

// errors
emitter.on("error", errorEvent);
emitter.on("connectionError", connectionErrorEvent);
emitter.on("unknownError", unknownErrorEvent);

// processing
emitter.on("fetchProcess", fetchProcessEvent);
emitter.on("timerWaitingProcess", timerWaitingProcessEvent);

// completed
emitter.on("successCompletedProcess", successCompletedProcessEvent);
emitter.on("failureCompletedProcess", failureCompletedProcessEvent);
emitter.on("timeoutCompletedProcess", timeoutCompletedProcessEvent);
