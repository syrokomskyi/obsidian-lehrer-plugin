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
    emitter.emit("successCompletedProcess", { id: "some-id" });
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

  $appStatus.set("request-flow");
  // TODO
  // test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // set a timer
  const waitingInSeconds = 12;
  $expectedWaitingTime.set(waitingInSeconds);
  $appStatus.set("waiting-result");

  const intervalInSeconds = 1;
  const timer = setInterval(() => {
    const seconds = $expectedWaitingTime.get() - intervalInSeconds;
    emitter.emit("timerWaitingProcess", { waitingTime: seconds });
  }, intervalInSeconds * 1000);
  await new Promise((resolve) => setTimeout(resolve, waitingInSeconds * 1000));
  clearInterval(timer);

  // fetch a result
  $appStatus.set("fetch-result");
  // TODO
  // test
  await new Promise((resolve) => setTimeout(resolve, 3000));

  emitter.emit("successCompletedProcess", { id: "some-id" });
}

export interface WaitingProcessParam {
  waitingTime: number;
}

export function timerWaitingProcessEvent({ waitingTime }: WaitingProcessParam) {
  console.log("timerWaitingProcess", { waitingTime });

  $expectedWaitingTime.set(waitingTime);
}
