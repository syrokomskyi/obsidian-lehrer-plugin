import { $appState, $expectedWaitingTime } from "lib/store/state";
import { emitter } from "./emitter";

export interface FetchProcessParam {
  session: string;
  content: string;
}

export interface WaitingProcessParam {
  waitingTime: number;
}

export async function fetchProcessEvent({
  session,
  content,
}: FetchProcessParam) {
  console.log("fetchProcess", { session, content });

  $appState.set("request-flow");
  // TODO
  // test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // set a timer
  const waitingInSeconds = 12;
  $expectedWaitingTime.set(waitingInSeconds);
  $appState.set("waiting-result");

  const intervalInSeconds = 1;
  const timer = setInterval(() => {
    const seconds = $expectedWaitingTime.get() - intervalInSeconds;
    emitter.emit("timerWaitingProcess", { waitingTime: seconds });
  }, intervalInSeconds * 1000);
  await new Promise((resolve) => setTimeout(resolve, waitingInSeconds * 1000));
  clearInterval(timer);

  // fetch a result
  $appState.set("fetch-result");
  // TODO
  // test
  await new Promise((resolve) => setTimeout(resolve, 3000));

  emitter.emit("successCompletedProcess", { id: "some-id" });
}

export function timerWaitingProcessEvent({ waitingTime }: WaitingProcessParam) {
  console.log("timerWaitingProcess", { waitingTime });

  $expectedWaitingTime.set(waitingTime);
}
