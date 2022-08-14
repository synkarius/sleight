import { SleightDataExportFormat } from '../data-formats';

export enum ImportResultType {
  VALID,
  INVALID,
}

type ValidImportResult = {
  readonly type: typeof ImportResultType.VALID;
  readonly data: SleightDataExportFormat;
};

type InvalidImportResult = {
  readonly type: typeof ImportResultType.INVALID;
};

export type ImportResult = ValidImportResult | InvalidImportResult;
