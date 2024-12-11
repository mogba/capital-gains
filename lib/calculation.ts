import {
  CUT_FOR_TAX_INCIDENCE,
  GAIN_TAX_PERCENTAGE_DECIMAL,
} from "./constants.ts";
import type { Operation, Tax } from "./calculation.types.ts";

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
}

function calculateLoss(weightedMeanPrice: number, operation: Operation) {
  return (
    weightedMeanPrice * operation.quantity -
    operation.unitCost * operation.quantity
  );
}

function calculateGain(operation: Operation, weightedMeanPrice: number) {
  return (
    operation.unitCost * operation.quantity -
    weightedMeanPrice * operation.quantity
  );
}

export async function calculateCapitalGains(
  operationsLines: Operation[][]
): Promise<Tax[][]> {
  const promise = async (operations: Operation[]) => {
    let shareCount = 0;
    let totalLoss = 0;
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
        totalLoss = 0;

        taxes.push({ tax: 0 });
        continue;
      }

      if (operation.operation === "sell") {
        shareCount -= operation.quantity;

        if (operation.unitCost < weightedMeanPrice) {
          // Loss

          const loss = calculateLoss(weightedMeanPrice, operation);
          totalLoss -= loss;

          taxes.push({ tax: 0 });
          continue;
        }

        // Gain

        const gain = calculateGain(operation, weightedMeanPrice);
        const lossDeducedGain = totalLoss + gain;

        totalLoss += gain;

        const isTotalOperationValueLessThanCutForTaxIncidence =
          operation.unitCost * operation.quantity < CUT_FOR_TAX_INCIDENCE;
        const isLossDeducedGainZero = lossDeducedGain < 0;

        if (
          isTotalOperationValueLessThanCutForTaxIncidence ||
          isLossDeducedGainZero
        ) {
          taxes.push({ tax: 0 });
          continue;
        }

        // Only round decimals at the end
        const tax = roundToTwoDecimals(
          lossDeducedGain * GAIN_TAX_PERCENTAGE_DECIMAL
        );

        taxes.push({ tax });
        continue;
      }

      taxes.push({ tax: -1 });
    }

    return taxes;
  };

  const result = await Promise.all(operationsLines.map(promise));
  return result;
}
