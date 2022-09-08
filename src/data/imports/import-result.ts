import { SleightDataInternalFormat } from '../data-formats';

export enum ImportResultType {
  VALID,
  INVALID,
}

type ValidImportResult = {
  readonly type: typeof ImportResultType.VALID;
  readonly version: string;
  readonly data: SleightDataInternalFormat;
};

type InvalidImportResult = {
  readonly type: typeof ImportResultType.INVALID;
};

export type ImportResult = ValidImportResult | InvalidImportResult;
