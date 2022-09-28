import { Container, injected } from 'brandi';
import { CopyingImportDataMerger } from '../../../data/imports/import-data-merger';
import { Tokens } from '../brandi-tokens';

export const bindDataMerger = (container: Container): void => {
  container
    .bind(Tokens.DataMerger)
    .toInstance(CopyingImportDataMerger)
    .inSingletonScope();
  injected(
    CopyingImportDataMerger,
    Tokens.SleightDataEvaluator,
    Tokens.SleightDataIdsRewriter,
    Tokens.RoleKeyedDataUpdater
  );
};
