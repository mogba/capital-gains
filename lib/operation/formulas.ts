import type { Operation } from "./calculator.types.ts";
import { GAIN_TAX_PERCENTAGE_DECIMAL } from "./constants.ts";

export function calculateWeightedMeanPrice(
  operation: Operation,
  shareCount: number,
  weightedMeanPrice: number
): number {
  const result =
    (shareCount * weightedMeanPrice + operation.quantity * operation.unitCost) /
    (shareCount + operation.quantity);

  return result;
}

export function calculateLoss(
  operation: Operation,
  weightedMeanPrice: number,
  totalLoss: number
) {
  const newTotalLoss =
    weightedMeanPrice * operation.quantity -
    operation.unitCost * operation.quantity;
  return totalLoss - newTotalLoss;
}

export function calculateGain(operation: Operation, weightedMeanPrice: number) {
  return (
    operation.unitCost * operation.quantity -
    weightedMeanPrice * operation.quantity
  );
}

export function calculateLossAfterGain(totalLoss: number, gain: number) {
  return totalLoss - gain;
}

export function calculateOperationCost(unitCost: number, quantity: number) {
  return unitCost * quantity;
}

export function calculateTax(lossAfterGain: number) {
  return lossAfterGain * GAIN_TAX_PERCENTAGE_DECIMAL;
}
