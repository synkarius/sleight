import { SleightDataInternalFormat } from '../data-formats';

export enum DeserializationResultType {
  VALID,
  INVALID,
}

type ValidDeserializationResult = {
  readonly type: typeof DeserializationResultType.VALID;
  readonly version: string;
  readonly data: SleightDataInternalFormat;
};

type InvalidDeserializationResult = {
  readonly type: typeof DeserializationResultType.INVALID;
};

export type DeserializationResult =
  | ValidDeserializationResult
  | InvalidDeserializationResult;
