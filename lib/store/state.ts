import { updateView } from "lib/view";
import { atom } from "nanostores";

type AppStatus =
  | "undefined"

  // error
  | "connection-error"
  | "unknown-error"

  // process
  | "read-note"
  | "request-flow"
  | "waiting-result"
  | "fetch-result"

  // completed
  | "success-completed"
  | "failure-completed"
  | "timeout-completed";

// see https://github.com/nanostores/nanostores
export const $appStatus = atom<AppStatus>("undefined");
$appStatus.subscribe((oldStatus: AppStatus, newStatus?: AppStatus) => {
  if (oldStatus === newStatus) {
    return;
  }

  console.log(`Status changed: '${oldStatus}' -> '${newStatus}'`);
  updateView();
});

export const $session = atom<string>("");

export const $view = atom<HTMLElement | undefined>(undefined);

export const $lastError = atom<string | object | undefined>(undefined);

// flow contract
export const $flowContractId = atom<string>("");
export const $flowContractVaultId = atom<string>("");

// waiting timer
export const $expectedWaitingTime = atom<number>(-1);

// cached result
// TODO We can have many results: we have many notes.
export const $result = atom<string | undefined>(undefined);

export function resetAppState(status: AppStatus = "undefined") {
  $session.set("");

  $lastError.set(undefined);

  $flowContractId.set("");
  $flowContractVaultId.set("");

  $expectedWaitingTime.set(-1);

  $result.set(undefined);

  // should be the last for run `updateView()` after cleared
  $appStatus.set(status);
  $view.set(undefined);
}
