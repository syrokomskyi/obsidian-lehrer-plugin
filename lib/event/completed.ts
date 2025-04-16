import { $appStatus } from "lib/store/state";

export interface SuccessCompletedProcessParam {
  session: string;
}

export interface FailureCompletedProcessParam {
  session: string;
  error: string;
}

export interface TimeoutCompletedProcessParam {
  session: string;
}

export function successCompletedProcessEvent({
  session,
}: SuccessCompletedProcessParam) {
  console.log("successCompletedProcess:", { session });

  $appStatus.set("success-completed");
}

export function failureCompletedProcessEvent({
  session,
  error,
}: FailureCompletedProcessParam) {
  console.log("failureCompletedProcess:", { session, error });

  $appStatus.set("failure-completed");
}

export function timeoutCompletedProcessEvent({
  session,
}: TimeoutCompletedProcessParam) {
  console.log("timeoutCompletedProcess:", { session });

  $appStatus.set("timeout-completed");
}
