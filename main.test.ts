import { assertEquals } from "@std/assert/equals";

// To be able to run this test, run "deno task test" or "deno test --allow-read --allow-run".
Deno.test(
  "[capital gains calculation cli app] it should run CLI app gracefully from the terminal",
  async () => {
    // Arrange
    const process = new Deno.Command(Deno.execPath(), {
      args: ["run", "--quiet", "main.ts"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    const input = `
      [{"operation":"buy","unit-cost":10,"quantity":100}]
      [{"operation":"buy","unit-cost":10,"quantity":100},{"operation":"sell","unit-cost":15,"quantity":50}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":20,"quantity":5000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":20,"quantity":5000},{"operation":"sell","unit-cost":5,"quantity":5000}]
      [{"operation":"buy","unit-cost":10,"quantity":100},{"operation":"sell","unit-cost":15,"quantity":50},{"operation":"sell","unit-cost":15,"quantity":50}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":20,"quantity":5000},{"operation":"sell","unit-cost":5,"quantity":5000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":5,"quantity":5000},{"operation":"sell","unit-cost":20,"quantity":3000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"buy","unit-cost":25,"quantity":5000},{"operation":"sell","unit-cost":15,"quantity":10000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"buy","unit-cost":25,"quantity":5000},{"operation":"sell","unit-cost":15,"quantity":10000},{"operation":"sell","unit-cost":25,"quantity":5000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":2,"quantity":5000},{"operation":"sell","unit-cost":20,"quantity":2000},{"operation":"sell","unit-cost":20,"quantity":2000},{"operation":"sell","unit-cost":25,"quantity":1000}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":2,"quantity":5000},{"operation":"sell","unit-cost":20,"quantity":2000},{"operation":"sell","unit-cost":20,"quantity":2000},{"operation":"sell","unit-cost":25,"quantity":1000},{"operation":"buy","unit-cost":20,"quantity":10000},{"operation":"sell","unit-cost":15,"quantity":5000},{"operation":"sell","unit-cost":30,"quantity":4350},{"operation":"sell","unit-cost":30,"quantity":650}]
      [{"operation":"buy","unit-cost":10,"quantity":10000},{"operation":"sell","unit-cost":50,"quantity":10000},{"operation":"buy","unit-cost":20,"quantity":10000},{"operation":"sell","unit-cost":50,"quantity":10000}]
    `;

    // IMPORTANT: This indentation was deliberately placed like this in order to correctly assert to the actual output.
    const expectedOutput = `
[
  [ { tax: 0 } ],
  [ { tax: 0 }, { tax: 0 } ],
  [ { tax: 0 }, { tax: 10000 } ],
  [ { tax: 0 }, { tax: 10000 }, { tax: 0 } ],
  [ { tax: 0 }, { tax: 0 }, { tax: 0 } ],
  [ { tax: 0 }, { tax: 10000 }, { tax: 0 } ],
  [ { tax: 0 }, { tax: 0 }, { tax: 1000 } ],
  [ { tax: 0 }, { tax: 0 }, { tax: 0 } ],
  [ { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 10000 } ],
  [ { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 3000 } ],
  [
    { tax: 0 },
    { tax: 0 },
    { tax: 0 },
    { tax: 0 },
    { tax: 3000 },
    { tax: 0 },
    { tax: 0 },
    { tax: 3700 },
    { tax: 0 }
  ],
  [ { tax: 0 }, { tax: 80000 }, { tax: 0 }, { tax: 60000 } ]
]
    `;

    const command = process.spawn();
    const writer = command.stdin.getWriter();
    await writer.write(new TextEncoder().encode(input));
    await writer.close();

    // Act
    const { code: exitCode } = await command.status;
    const rawOutput = await command.output(); // stdout
    const output = new TextDecoder().decode(rawOutput.stdout);

    // Assert
    assertEquals(exitCode, 0);
    assertEquals(output.trim(), expectedOutput.trim());
  }
);
