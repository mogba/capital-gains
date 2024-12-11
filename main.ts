import {
  CUT_FOR_TAX_INCIDENCE,
  PROFIT_TAX_PERCENTAGE_DECIMALS,
} from "./constants.ts";
import type { Operation, OperationType, Tax } from "./types.ts";

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateWeightedMeanPrice(
  currentState: { shareCount: number; weightedMeanPrice: number },
  operation: Operation
): number {
  const result =
    (currentState.shareCount * currentState.weightedMeanPrice +
      operation.quantity * operation.unitCost) /
    (currentState.shareCount + operation.quantity);

  return result;
  // return roundToTwoDecimals(result);
}

export async function calculateCapitalGains(
  operations: Operation[]
): Promise<Tax[]> {
  let shareCount = 0;
  let balance = 0;
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
      // Consider the remaining balance is used to buy new shares,
      // thus the current balance resets
      balance = 0;

      taxes.push({ tax: 0 });
      continue;
    }

    if (operation.operation === "sell") {
      shareCount -= operation.quantity;

      if (operation.unitCost < weightedMeanPrice) {
        // Loss

        // Store loss value to deduce in future profits
        const loss =
          weightedMeanPrice * operation.quantity -
          operation.unitCost * operation.quantity;

        balance -= loss;

        taxes.push({ tax: 0 });
        continue;
      }

      // Profit

      const profit =
        operation.unitCost * operation.quantity -
        weightedMeanPrice * operation.quantity;
      const actualProfit = balance + profit;

      balance += profit;

      const isTotalOperationValueLessThanCutForTaxIncidence =
        operation.unitCost * operation.quantity < CUT_FOR_TAX_INCIDENCE;
      const isLossDeducedProfitZero = actualProfit < 0;

      if (
        isTotalOperationValueLessThanCutForTaxIncidence ||
        isLossDeducedProfitZero
      ) {
        taxes.push({ tax: 0 });
        continue;
      }

      // Round decimals only at the end
      const tax = roundToTwoDecimals(
        actualProfit * PROFIT_TAX_PERCENTAGE_DECIMALS
      );

      taxes.push({ tax });
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
