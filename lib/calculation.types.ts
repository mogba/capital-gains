export type OperationType = "buy" | "sell";

export type Operation = {
  operation: OperationType;
  unitCost: number;
  quantity: number;
};

export type Tax = {
  tax: number;
};

export type Balance = {
  weightedMeanPrice: number;
  shareCount: number;
  totalLoss: number;
};

export type CalcArgsObj = {
  operation: Operation;
  weightedMeanPrice: number;
  shareCount: number;
  totalLoss?: number;
};

export type CalcResultObj = {
  tax: Tax;
} & Balance;

export type OpCalcFn = (calcArgs: CalcArgsObj) => CalcResultObj;
