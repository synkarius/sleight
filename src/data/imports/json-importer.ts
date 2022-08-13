import { ImportResult, ImportResultType } from './import-result';

export const jsonImporter = {
  import: (data: string): ImportResult => {
    try {
      // TODO: implement this
      return {
        type: ImportResultType.INVALID,
      };
    } catch (e) {
      return {
        type: ImportResultType.INVALID,
      };
    }
  },
};
