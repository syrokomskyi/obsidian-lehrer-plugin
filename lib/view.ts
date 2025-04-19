import {
  $appStatus,
  $expectedWaitingTime,
  $lastError,
  $view,
} from "./store/state";

// TODO Many notes.
let statusElement: HTMLElement;

export function updateView() {
  const view = $view?.get();
  if (!view) {
    return;
  }

  const status = $appStatus.get();
  console.log("viewHandler", { state: status });

  statusElement ??= view.createEl("pre", { text: "Processing..." });

  if (status === "read-note") {
    statusElement.setText("Reading note...");
    return;
  }

  if (status === "request-flow") {
    statusElement.setText("Requesting flow...");
    return;
  }

  if (status === "waiting-result") {
    const seconds = $expectedWaitingTime.get();
    statusElement.setText(`Waiting result... ${seconds} s`);
    return;
  }

  if (status === "fetch-result") {
    statusElement.setText("Fetching result...");
    return;
  }

  if (status === "success-completed") {
    statusElement.setText("Processing completed.");
    return;
  }

  if (status === "failure-completed") {
    const lastError = $lastError.get();
    statusElement.setText(
      `Processing completed with error.\n\n${lastError ? lastError : ""}`,
    );
    return;
  }

  if (status === "timeout-completed") {
    statusElement.setText("Processing timeout.");
    return;
  }

  // any other status
  statusElement.setText(`TODO ${status}`);
}
