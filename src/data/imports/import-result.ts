import { SleightDataFormat } from '../json-format';

export enum ImportResultType {
  VALID,
  INVALID,
}

type ValidImportResult = {
  readonly type: typeof ImportResultType.VALID;
  readonly data: SleightDataFormat;
};

type InvalidImportResult = {
  readonly type: typeof ImportResultType.INVALID;
};

export type ImportResult = ValidImportResult | InvalidImportResult;
