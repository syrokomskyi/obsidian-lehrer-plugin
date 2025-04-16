import { type BriefContract, checkContract } from "@webgogol/core-share";
import { load } from "js-yaml";
import { $appStatus, $expectedWaitingTime, $result } from "lib/store/state";
import { emitter } from "./emitter";

export interface ReadNoteProcessParam {
  session: string;
  content: string;
}

export async function readNoteProcessEvent({
  session,
  content,
}: ReadNoteProcessParam) {
  console.log("readNoteProcess", { content });

  $appStatus.set("read-note");

  // check a completed and cached early result
  if ($result.get()) {
    emitter.emit("successCompletedProcess", { session });
    return;
  }

  // request a result from backend
  emitter.emit("fetchProcess", { session, content });
}

export interface FetchProcessParam {
  session: string;
  content: string;
}

export async function fetchProcessEvent({
  session,
  content,
}: FetchProcessParam) {
  console.log("fetchProcess", { session, content });

  $appStatus.set("fetch-result");

  // fetch a result
  const response = await fetch(`http://127.0.0.1:8787/v1/flow/${session}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: content,
  });
  console.log("fetchProcess", { response });
  if (response.status !== 200) {
    emitter.emit("failureCompletedProcess", {
      session,
      error: response.statusText,
    });
  }

  const body = await response.text();
  console.log("fetchProcess", { body });

  const contract = load(body) as BriefContract;
  console.log("fetchProcess", { contract });

  // check a contract
  try {
    checkContract(contract);
  } catch (error) {
    emitter.emit("failureCompletedProcess", {
      session,
      error,
    });
    return;
  }

  // set a timer for waiting result
  const waitingInSeconds = contract.estimatedDuration;
  $expectedWaitingTime.set(waitingInSeconds);
  $appStatus.set("waiting-result");

  const intervalInSeconds = 1;
  const timer = setInterval(() => {
    const seconds = $expectedWaitingTime.get() - intervalInSeconds;
    emitter.emit("timerWaitingProcess", { waitingTime: seconds });
  }, intervalInSeconds * 1000);
  await new Promise((resolve) => setTimeout(resolve, waitingInSeconds * 1000));
  clearInterval(timer);

  emitter.emit("successCompletedProcess", { session });
}

export interface WaitingProcessParam {
  waitingTime: number;
}

export function timerWaitingProcessEvent({ waitingTime }: WaitingProcessParam) {
  console.log("timerWaitingProcess", { waitingTime });

  $expectedWaitingTime.set(waitingTime);
}
