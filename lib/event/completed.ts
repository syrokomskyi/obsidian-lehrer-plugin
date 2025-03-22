import { $appState } from "lib/store/state";

export interface SuccessCompletedProcessParam {
  id: string;
}

export interface FailureCompletedProcessParam {
  id: string;
  error: string;
}

export interface TimeoutCompletedProcessParam {
  id: string;
}

export function successCompletedProcessEvent({
  id,
}: SuccessCompletedProcessParam) {
  console.log("successCompletedProcess:", { id });

  $appState.set("success-completed");
}

export function failureCompletedProcessEvent({
  id,
  error,
}: FailureCompletedProcessParam) {
  console.log("failureCompletedProcess:", { id, error });

  $appState.set("failure-completed");
}

export function timeoutCompletedProcessEvent({
  id,
}: TimeoutCompletedProcessParam) {
  console.log("timeoutCompletedProcess:", { id });

  $appState.set("timeout-completed");
}
