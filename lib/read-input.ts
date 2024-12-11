import { STDIN_BUFFER_LENGTH } from "./constants.ts";

export async function readInput(): Promise<string[]> {
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(STDIN_BUFFER_LENGTH);
  const lines: string[] = [];

  while (true) {
    const bytesRead = await Deno.stdin.read(buffer);

    if (bytesRead === null) {
      // EOF reached
      break;
    }

    const input = decoder.decode(buffer.subarray(0, bytesRead));

    lines.push(
      ...input
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    );
  }

  return lines;
}
