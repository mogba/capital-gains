import { assertEquals } from "@std/assert";

import { CUT_FOR_TAX_INCIDENCE, PROFIT_TAX_PERCENTAGE } from "./constants.ts";
import { calculateCapitalGains } from "./main.ts";
import type { OperationType } from "./types.ts";

// Case #1
Deno.test(
  `[calculate capital gains] it should incide no tax for buy operations`,
  async () => {
    const input = [
      [{ operation: "buy" as OperationType, unitCost: 10.0, quantity: 100 }],
    ];
    const expectedOutput = [[{ tax: 0 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #1
Deno.test(
  `[calculate capital gains] it should incide no tax for sell operations which total cost is lower than ${CUT_FOR_TAX_INCIDENCE}`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 100 },
        { operation: "sell" as OperationType, unitCost: 15, quantity: 50 },
      ],
    ];
    const expectedOutput = [[{ tax: 0 }, { tax: 0 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #2
Deno.test(
  `[calculate capital gains] it should incide tax of ${PROFIT_TAX_PERCENTAGE}% on gains of sell operations`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 20, quantity: 5_000 },
      ],
    ];
    const expectedOutput = [[{ tax: 0 }, { tax: 10_000 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #2
Deno.test(
  `[calculate capital gains] it should incide no tax for sell operations with loss`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 20, quantity: 5_000 },
        { operation: "sell" as OperationType, unitCost: 5, quantity: 5_000 },
      ],
    ];
    const expectedOutput = [[{ tax: 0 }, { tax: 10_000 }, { tax: 0 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #1 + #2
Deno.test(
  `[calculate capital gains] it should calculate operation lines independently`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 100 },
        { operation: "sell" as OperationType, unitCost: 15, quantity: 50 },
        { operation: "sell" as OperationType, unitCost: 15, quantity: 50 },
      ],
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 20, quantity: 5_000 },
        { operation: "sell" as OperationType, unitCost: 5, quantity: 5_000 },
      ],
    ];
    const expectedOutput = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }],
      [{ tax: 0 }, { tax: 10_000 }, { tax: 0 }],
    ];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #3
Deno.test(
  `[calculate capital gains] it should deduce loss from gains and incide tax of ${PROFIT_TAX_PERCENTAGE}% from ramainder gains`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 5, quantity: 5_000 },
        { operation: "sell" as OperationType, unitCost: 20, quantity: 3_000 },
      ],
    ];
    const expectedOutput = [[{ tax: 0 }, { tax: 0 }, { tax: 1_000 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #4
Deno.test(
  `[calculate capital gains] it should incide no tax for operations in which there are no losses or gains`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "buy" as OperationType, unitCost: 25, quantity: 5_000 },
        {
          operation: "sell" as OperationType,
          unitCost: 15,
          quantity: 10_000,
        },
      ],
    ];
    const expectedOutput = [[{ tax: 0 }, { tax: 0 }, { tax: 0 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #5
Deno.test(
  `[calculate capital gains] it should calculate weighted mean price based on multiple buy operations`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "buy" as OperationType, unitCost: 25, quantity: 5_000 },
        {
          operation: "sell" as OperationType,
          unitCost: 15,
          quantity: 10_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 25,
          quantity: 5_000,
        },
      ],
    ];
    const expectedOutput = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 10_000 }],
    ];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #6
Deno.test(
  `[calculate capital gains] it should deduce losses from gains of subsequent operations`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 2, quantity: 5_000 },
        {
          operation: "sell" as OperationType,
          unitCost: 20,
          quantity: 2_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 20,
          quantity: 2_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 25,
          quantity: 1_000,
        },
      ],
    ];
    const expectedOutput = [
      [{ tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 0 }, { tax: 3_000 }],
    ];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #7
Deno.test(
  `[calculate capital gains] it should change the weighted mean price after all shares are sold out and new ones are bought`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 2, quantity: 5_000 },
        {
          operation: "sell" as OperationType,
          unitCost: 20,
          quantity: 2_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 20,
          quantity: 2_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 25,
          quantity: 1_000,
        },
        {
          operation: "buy" as OperationType,
          unitCost: 20,
          quantity: 10_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 15,
          quantity: 5_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 30,
          quantity: 4_350,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 30,
          quantity: 650,
        },
      ],
    ];
    const expectedOutput = [
      [
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 3_000 },
        { tax: 0 },
        { tax: 0 },
        { tax: 3_700 },
        { tax: 0 },
      ],
    ];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);

// Case #8
Deno.test(
  `[calculate capital gains] it should incide tax on gains after the weighted mean price changes`,
  async () => {
    const input = [
      [
        { operation: "buy" as OperationType, unitCost: 10, quantity: 10_000 },
        { operation: "sell" as OperationType, unitCost: 50, quantity: 10_000 },
        {
          operation: "buy" as OperationType,
          unitCost: 20,
          quantity: 10_000,
        },
        {
          operation: "sell" as OperationType,
          unitCost: 50,
          quantity: 10_000,
        },
      ],
    ];
    const expectedOutput = [
      [{ tax: 0 }, { tax: 80_000 }, { tax: 0 }, { tax: 60_000 }],
    ];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  }
);
