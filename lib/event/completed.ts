import { $appStatus, $lastError, $view } from "lib/store/state";

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

  $lastError.set(undefined);
  $appStatus.set("success-completed");
  $view.set(undefined);
}

export function failureCompletedProcessEvent({
  session,
  error,
}: FailureCompletedProcessParam) {
  console.error("failureCompletedProcess:", { session, error });

  $lastError.set(error);
  $appStatus.set("failure-completed");
  $view.set(undefined);
}

export function timeoutCompletedProcessEvent({
  session,
}: TimeoutCompletedProcessParam) {
  console.warn("timeoutCompletedProcess:", { session });

  $lastError.set(undefined);
  $appStatus.set("timeout-completed");
  $view.set(undefined);
}
