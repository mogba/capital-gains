import { kebabToCamel, STDIN_BUFFER_LENGTH } from "./index.ts";

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

export async function readJsonInput<T>(): Promise<T[]> {
  const lines = await readInput();
  const output: T[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(kebabToCamel(line)) as T;
      output.push(parsed);
    } catch (_) {
      console.error("Invalid JSON input:", line);
      Deno.exit(0);
    }
  }

  return output;
}
