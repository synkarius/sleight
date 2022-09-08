import { ImportResult, ImportResultType } from './import-result';
import {
  convertSleightExternalFormatToInternal,
  SleightDataExportFormat,
} from '../data-formats';

export type Importer = {
  import: (data: string) => ImportResult;
};

export const getJsonImporter: () => Importer = () => ({
  import: (data: string): ImportResult => {
    try {
      const parsed = JSON.parse(data) as SleightDataExportFormat;
      const internalFormat = convertSleightExternalFormatToInternal(parsed);
      return {
        type: ImportResultType.VALID,
        version: parsed.version,
        data: internalFormat,
      };
    } catch (e: unknown) {
      return {
        type: ImportResultType.INVALID,
      };
    }
  },
});
