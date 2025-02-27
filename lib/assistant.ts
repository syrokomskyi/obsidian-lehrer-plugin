export async function assistant(content: string): Promise<void> {
  console.log("assistant process start with content", content);

  const session = "123456";
  console.log("assistant process start with session", session);

  const response = await fetch(`http://127.0.0.1:8787/v1/${session}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: content,
  });

  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log("assistant process complete with response", response);
}
