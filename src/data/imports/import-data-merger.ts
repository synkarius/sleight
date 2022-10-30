import { SleightDataInternalFormat } from '../data-formats';
import { SleightDataMerger } from './data-merger';
import { SleightDataEvaluator } from './model-update/evaluators/sleight-data-evaluator';
import { SleightDataIdsRewriter } from './model-update/id-rewriter/sleight-data-ids-rewriter';
import { RoleKeyedDataUpdater } from './model-update/rolekeyed-data-updater';

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
    private sleightDataIdsRewriter: SleightDataIdsRewriter,
    private rolekeyedDataUpdater: RoleKeyedDataUpdater,
    private sleightDataMerger: SleightDataMerger
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
    const updated = this.rolekeyedDataUpdater.update(
      baseCopy,
      evaluation.override
    );

    // the result here should be base with updated overlaid and idsRewritten added
    // -- spread base over rewritten (which SHOULD just be additive), then updated over base
    return this.sleightDataMerger.merge(
      this.sleightDataMerger.merge(base, updated),
      idsRewrittenData
    );
  }
}
