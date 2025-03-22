import { atom } from "nanostores";

type AppState =
  | "undefined"

  // error
  | "connection-error"
  | "unknown-error"

  // process
  | "request-flow"
  | "waiting-result"
  | "fetch-result"

  // completed
  | "success-completed"
  | "failure-completed"
  | "timeout-completed";

// see https://github.com/nanostores/nanostores
export const $appState = atom<AppState>("undefined");

export const $session = atom<string>("");

// flow contract
export const $flowContractId = atom<string>("");
export const $flowContractVaultId = atom<string>("");

// waiting timer
export const $expectedWaitingTime = atom<number>(-1);

export function resetAppState(state: AppState = "undefined") {
  $appState.set(state);

  $flowContractId.set("");
  $flowContractVaultId.set("");

  $expectedWaitingTime.set(-1);
}
