export function errorEvent(error: Error) {
  console.log("error:", error);
}

export function connectionErrorEvent(error: Error) {
  console.log("connectionError:", { error });
}

export function unknownErrorEvent(error: Error) {
  console.log("unknownError:", { error });
}
