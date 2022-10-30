export enum CompositeValidationResultType {
  VALID,
  INVALID,
}

type ValidResult = {
  status: typeof CompositeValidationResultType.VALID;
};

type Invalidated = {
  id: string;
  message: string;
};

type InvalidCompositeValidationResult = {
  status: typeof CompositeValidationResultType.INVALID;
  invalidated: Invalidated[];
};

export type CompositeValidationResult =
  | ValidResult
  | InvalidCompositeValidationResult;

export const isInvalidCompositeValidationResult = (
  result: CompositeValidationResult
): result is InvalidCompositeValidationResult =>
  result.status === CompositeValidationResultType.INVALID;
