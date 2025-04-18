import { $appStatus, $lastError } from "lib/store/state";

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
  $lastError.set(null);
}

export function failureCompletedProcessEvent({
  session,
  error,
}: FailureCompletedProcessParam) {
  console.error("failureCompletedProcess:", { session, error });

  $appStatus.set("failure-completed");
  $lastError.set(error);
}

export function timeoutCompletedProcessEvent({
  session,
}: TimeoutCompletedProcessParam) {
  console.warn("timeoutCompletedProcess:", { session });

  $appStatus.set("timeout-completed");
  $lastError.set(null);
}
