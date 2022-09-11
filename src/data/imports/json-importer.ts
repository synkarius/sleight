import { ImportResult, ImportResultType } from './import-result';
import { SleightDataExportFormat } from '../data-formats';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';

export type Importer = {
  import: (data: string) => ImportResult;
};

export const getJsonImporter: () => Importer = () => ({
  import: (data: string): ImportResult => {
    const injected = getDefaultInjectionContext();
    const formatMapper = injected.mappers.dataFormat;
    try {
      const parsed = JSON.parse(data) as SleightDataExportFormat;
      const internalFormat = formatMapper.externalFormatToInternal(parsed);
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
