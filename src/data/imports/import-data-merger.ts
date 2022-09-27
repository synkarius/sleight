import { SleightDataInternalFormat } from '../data-formats';
import { SleightDataEvaluator } from './model-update/evaluators/sleight-data-evaluator';
import { SleightDataIdsRewriter } from './model-update/id-rewriter/sleight-data-ids-rewriter';

/** Merges import data over existing data. */
export type ImportDataMerger = {
  merge: (
    base: SleightDataInternalFormat,
    imported: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export class CopyingImportDataMerger implements ImportDataMerger {
  constructor(
    private sleightDataEvaluator: SleightDataEvaluator,
    private sleightDataIdsRewriter: SleightDataIdsRewriter
  ) {}

  merge(
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    const baseCopy = structuredClone(base);
    const deserializedCopy = structuredClone(deserialized);

    const evaluation = this.sleightDataEvaluator.evaluate(
      baseCopy,
      deserializedCopy
    );
    const idsRewrittenData = this.sleightDataIdsRewriter.rewriteIds(
      evaluation.rewriteIds
    );
    // TODO: then model updates based on those evaluations

    return {
      ...baseCopy,
      ...deserializedCopy,
    };
  }
}
