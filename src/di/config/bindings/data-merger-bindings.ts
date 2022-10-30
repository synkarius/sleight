import { Container, injected } from 'brandi';
import { SpreadingDataMerger } from '../../../data/imports/data-merger';
import { CopyingImportDataMerger } from '../../../data/imports/import-data-merger';
import { Tokens } from '../brandi-tokens';

export const bindDataMerger = (container: Container): void => {
  container
    .bind(Tokens.SleightDataMerger)
    .toInstance(SpreadingDataMerger)
    .inSingletonScope();
  container
    .bind(Tokens.ImportDataMerger)
    .toInstance(CopyingImportDataMerger)
    .inSingletonScope();
  injected(
    CopyingImportDataMerger,
    Tokens.SleightDataEvaluator,
    Tokens.SleightDataIdsRewriter,
    Tokens.RoleKeyedDataUpdater,
    Tokens.SleightDataMerger
  );
};
