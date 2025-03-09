import {
  CUT_FOR_TAX_INCIDENCE,
  GAIN_TAX_PERCENTAGE_DECIMAL,
  type Balance,
  type CalcArgsObj,
  type CalcResultObj,
  type OpCalcFn,
  type Operation,
  type OperationType,
  type Tax,
} from "./index.ts";

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

function calculateSellWithLoss({
  operation,
  shareCount,
  weightedMeanPrice,
  totalLoss,
}: CalcArgsObj): CalcResultObj {
  const loss =
    weightedMeanPrice * operation.quantity -
    operation.unitCost * operation.quantity;

  return {
    tax: { tax: 0 },
    weightedMeanPrice,
    shareCount,
    totalLoss: totalLoss! - loss,
  };
}

function calculateGain(operation: Operation, weightedMeanPrice: number) {
  return (
    operation.unitCost * operation.quantity -
    weightedMeanPrice * operation.quantity
  );
}

function incidesTax(operation: Operation, lossAfterGain: number) {
  const isTotalOperationValueLessThanCutForTaxIncidence =
    operation.unitCost * operation.quantity < CUT_FOR_TAX_INCIDENCE;
  const isLossDeducedGainZero = lossAfterGain < 0;

  return !(
    isTotalOperationValueLessThanCutForTaxIncidence || isLossDeducedGainZero
  );
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateSellWithGain({
  operation,
  shareCount,
  weightedMeanPrice,
  totalLoss,
}: CalcArgsObj) {
  const lossAfterGain =
    totalLoss! - calculateGain(operation, weightedMeanPrice);
  const tax = incidesTax(operation, lossAfterGain)
    ? { tax: 0 }
    : { tax: roundToTwoDecimals(lossAfterGain * GAIN_TAX_PERCENTAGE_DECIMAL) };

  return {
    tax,
    weightedMeanPrice,
    shareCount,
    totalLoss: lossAfterGain,
  };
}

const calculateBuy: OpCalcFn = ({
  operation,
  shareCount,
  weightedMeanPrice,
}) => {
  const newWeightedMeanPrice = calculateWeightedMeanPrice(
    {
      shareCount,
      weightedMeanPrice,
    },
    operation
  );

  return {
    tax: { tax: 0 },
    weightedMeanPrice: newWeightedMeanPrice,
    shareCount: shareCount + operation.quantity,
    totalLoss: 0,
  };
};

const calculateSell: OpCalcFn = ({
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

const operationMap: Record<OperationType, OpCalcFn> = {
  buy: calculateBuy,
  sell: calculateSell,
};

function calcOps(
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
    operationMap[head.operation]?.({
      operation: head,
      ...balance,
    }) || balance;

  taxes.push(newBalance.tax);

  if (tail.length === 0) {
    return taxes;
  }

  return calcOps(tail, taxes, {
    weightedMeanPrice: newBalance.weightedMeanPrice,
    shareCount: newBalance.shareCount,
    totalLoss: newBalance.totalLoss,
  });
}

function iterateOpsLines(
  operationsLines: Operation[][],
  previousTaxesLines?: Tax[][]
): Tax[][] {
  const [head, ...tail] = operationsLines;

  const lineTaxes = calcOps(head);
  const taxesLines = [...(previousTaxesLines || []), lineTaxes];

  if (tail.length === 0) {
    return taxesLines;
  }

  return iterateOpsLines(tail, taxesLines);
}

export function calculateCapitalGains(operationsLines: Operation[][]) {
  return iterateOpsLines(operationsLines);
}
