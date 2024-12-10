import { assertEquals } from "@std/assert";

import type { OperationType } from "./types.ts";
import { calculateCapitalGains } from "./main.ts";
import {
  MAX_SELL_REVENUE_FOR_NO_TAX,
  PROFIT_TAX_PERCENTAGE,
} from "./constants.ts";

Deno.test("calculate capital gains", async (t) => {
  // Case #1
  await t.step(`it should output no tax for buy operations`, async () => {
    const input = [
      [{ operation: "buy" as OperationType, unitCost: 10.0, quantity: 100 }],
    ];
    const expectedOutput = [[{ tax: 0 }]];

    const output = await Promise.all(
      input.map((operations) => calculateCapitalGains(operations))
    );

    assertEquals(output, expectedOutput);
  });

  // Case #1
  await t.step(
    `it should output no tax for sell operations of less than ${MAX_SELL_REVENUE_FOR_NO_TAX}`,
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
  await t.step(
    `it should output ${PROFIT_TAX_PERCENTAGE}% profit tax of sell operations with profits`,
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
  await t.step(
    `it should output no tax for sell operations with loss`,
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
  await t.step(
    `it should calculate operation lines independently`,
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
  await t.step(
    `it should deduce loss from profits and output ${PROFIT_TAX_PERCENTAGE}% tax from remainder`,
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
  await t.step(
    `it should output no tax when there's no loss or profit`,
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
  await t.step(
    `it should output ${PROFIT_TAX_PERCENTAGE}% tax from 50_000 profit`,
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
  await t.step(
    `it should deduce profits and losses and output ${PROFIT_TAX_PERCENTAGE}% from 15_000 profit`,
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
  await t.step(`case #7`, async () => {
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
          operation: "sell" as OperationType,
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
  });

  // Case #8
  await t.step(`case #8`, async () => {
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
          quantity: 2_000,
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
  });
});
