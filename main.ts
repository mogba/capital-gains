import type { Operation, OperationType, Tax } from "./types.ts";

/**
 * nova-média-ponderada = ((quantidade-de-ações-atual * média-ponderada-atual) + (quantidade-de-ações-compradas * valor-de-compra)) / (quantidade-de-ações-atual + quantidade-de-ações-compradas)
 *
 * nova-média-ponderada = ((0 * 0) + (10 * 20.00)) / (0 + 10)
 * nova-média-ponderada = 20.0000
 *
 * nova-média-ponderada = ((10 * 20.00) + (10000 * 10.00)) / (10 + 10000)
 * nova-média-ponderada = 10.0099
 */

export function calculateWeightedMeanPrice(
  balance: { shareCount: number; weightedMeanPrice: number },
  operation: Operation
): number {
  return (
    (balance.shareCount * balance.weightedMeanPrice +
      operation.quantity * operation.unitCost) /
    (balance.shareCount + operation.quantity)
  );
}

export async function calculateCapitalGains(
  operations: Operation[]
): Promise<Tax[]> {
  let shareCount = 0;
  let weightedMeanPrice = 0;

  const taxes: Tax[] = [];

  for (const operation of operations) {
    if (operation.operation === "buy") {
      weightedMeanPrice = calculateWeightedMeanPrice(
        {
          shareCount,
          weightedMeanPrice,
        },
        operation
      );

      shareCount += operation.quantity;

      continue;
    }

    if (operation.operation === "sell") {
      shareCount -= operation.quantity;

      continue;
    }

    taxes.push({ tax: -1 });
  }

  return taxes;
}

const input = [
  [
    { operation: "buy" as OperationType, unitCost: 10.0, quantity: 100 },
    { operation: "sell" as OperationType, unitCost: 15.0, quantity: 50 },
    { operation: "sell" as OperationType, unitCost: 15.0, quantity: 50 },
  ],
  [
    { operation: "buy" as OperationType, unitCost: 10.0, quantity: 1000 },
    { operation: "buy" as OperationType, unitCost: 20.0, quantity: 5000 },
    { operation: "buy" as OperationType, unitCost: 5.0, quantity: 5000 },
  ],
];

const result = await Promise.all(
  input.map((operations) => calculateCapitalGains(operations))
);

result.forEach((taxes) => console.log(taxes));
