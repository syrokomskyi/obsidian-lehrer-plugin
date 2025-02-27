export async function assistant(content: string): Promise<void> {
  console.log("assistant process start with content", content);

  await new Promise((resolve) => setTimeout(resolve, 2100));

  console.log("assistant process complete");
}
