import { SleightDataInternalFormat } from '../data-formats';

/** Merges import data over existing data. */
export type ImportDataMerger = {
  merge: (
    base: SleightDataInternalFormat,
    override: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export const getCopyingImportDataMerger = (): ImportDataMerger => ({
  merge: (base, override) => ({
    ...structuredClone(base),
    ...structuredClone(override),
  }),
});
