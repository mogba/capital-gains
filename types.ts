export type OperationType = "buy" | "sell";

export type Operation = {
  operation: OperationType;
  unitCost: number;
  quantity: number;
};

export type Tax = {
  tax: number;
};
