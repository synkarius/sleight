import { ImportResult, ImportResultType } from './import-result';

export type Importer = {
  import: (data: string) => ImportResult;
};

export const jsonImporter: Importer = {
  import: (data: string): ImportResult => {
    try {
      JSON.parse(data);
      // TODO: implement this
      return {
        type: ImportResultType.INVALID,
      };
    } catch (e: unknown) {
      // if (e instanceof SyntaxError)
      return {
        type: ImportResultType.INVALID,
      };
    }
  },
};
