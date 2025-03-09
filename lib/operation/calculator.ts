import { roundToTwoDecimals } from "../utils/number/formatter.ts";

import type {
  Operation,
  CalcArgsObj,
  CalcResultObj,
  OpCalcFn,
  OperationType,
  Tax,
  Balance,
} from "./calculator.types.ts";
import { CUT_FOR_TAX_INCIDENCE } from "./constants.ts";
import {
  calculateGain,
  calculateLoss,
  calculateLossAfterGain,
  calculateOperationCost,
  calculateTax,
  calculateWeightedMeanPrice,
} from "./formulas.ts";

function calculateSellWithLoss({
  operation,
  shareCount,
  weightedMeanPrice,
  totalLoss,
}: CalcArgsObj): CalcResultObj {
  return {
    tax: { tax: 0 },
    weightedMeanPrice,
    shareCount,
    totalLoss: calculateLoss(operation, weightedMeanPrice, totalLoss!),
  };
}

function incidesTax(operation: Operation, lossAfterGain: number) {
  const isTotalOperationValueLessThanCutForTaxIncidence =
    calculateOperationCost(operation.unitCost, operation.quantity) <
    CUT_FOR_TAX_INCIDENCE;
  const isLossDeducedGainZero = lossAfterGain < 0;

  return !(
    isTotalOperationValueLessThanCutForTaxIncidence || isLossDeducedGainZero
  );
}

function calculateSellWithGain({
  operation,
  shareCount,
  weightedMeanPrice,
  totalLoss,
}: CalcArgsObj) {
  const lossAfterGain = calculateLossAfterGain(
    totalLoss!,
    calculateGain(operation, weightedMeanPrice)
  );

  const tax = incidesTax(operation, lossAfterGain)
    ? { tax: 0 }
    : { tax: roundToTwoDecimals(calculateTax(lossAfterGain)) };

  return {
    tax,
    weightedMeanPrice,
    shareCount,
    totalLoss: lossAfterGain,
  };
}

const processBuyOperation: OpCalcFn = ({
  operation,
  shareCount,
  weightedMeanPrice,
}) => {
  const newWeightedMeanPrice = calculateWeightedMeanPrice(
    operation,
    shareCount,
    weightedMeanPrice
  );

  return {
    tax: { tax: 0 },
    weightedMeanPrice: newWeightedMeanPrice,
    shareCount: shareCount + operation.quantity,
    totalLoss: 0,
  };
};

const processSellOperation: OpCalcFn = ({
  operation,
  shareCount,
  weightedMeanPrice,
  totalLoss,
}) => {
  if (operation.unitCost < weightedMeanPrice) {
    return calculateSellWithLoss({
      operation,
      shareCount,
      weightedMeanPrice,
      totalLoss,
    });
  }

  return calculateSellWithGain({
    operation,
    shareCount,
    weightedMeanPrice,
    totalLoss,
  });
};

const operationProcessorMap: Record<OperationType, OpCalcFn> = {
  buy: processBuyOperation,
  sell: processSellOperation,
};

function iterateOperations(
  operations: Operation[],
  previousTaxes?: Tax[],
  previousBalance?: Balance
): Tax[] {
  const [head, ...tail] = operations;
  const taxes = previousTaxes || [];
  const balance = {
    ...(previousBalance || {
      weightedMeanPrice: 0,
      shareCount: 0,
      totalLoss: 0,
    }),
    tax: { tax: -1 },
  };
  const newBalance =
    operationProcessorMap[head.operation]?.({
      operation: head,
      ...balance,
    }) || balance;

  taxes.push(newBalance.tax);

  if (tail.length === 0) {
    return taxes;
  }

  return iterateOperations(tail, taxes, {
    weightedMeanPrice: newBalance.weightedMeanPrice,
    shareCount: newBalance.shareCount,
    totalLoss: newBalance.totalLoss,
  });
}

function iterateOperationLines(
  operationsLines: Operation[][],
  previousTaxesLines?: Tax[][]
): Tax[][] {
  const [head, ...tail] = operationsLines;

  const lineTaxes = iterateOperations(head);
  const taxesLines = [...(previousTaxesLines || []), lineTaxes];

  if (tail.length === 0) {
    return taxesLines;
  }

  return iterateOperationLines(tail, taxesLines);
}

export function calculateCapitalGains(operationsLines: Operation[][]) {
  return iterateOperationLines(operationsLines);
}
