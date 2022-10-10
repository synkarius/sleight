import { SleightDataInternalFormat } from '../data-formats';
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
    private rolekeyedDataUpdater: RoleKeyedDataUpdater
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
    const ird = JSON.stringify(idsRewrittenData);
    const updated = this.rolekeyedDataUpdater.update(
      baseCopy,
      evaluation.override
    );

    // the result here should be base with updated overlaid and idsRewritten added
    // -- spread base over rewritten (which SHOULD just be additive), then updated over base
    return {
      actions: {
        ...base.actions,
        ...updated.actions,
        ...idsRewrittenData.actions,
      },
      commands: {
        ...base.commands,
        ...updated.commands,
        ...idsRewrittenData.commands,
      },
      contexts: {
        ...base.contexts,
        ...updated.contexts,
        ...idsRewrittenData.contexts,
      },
      fns: { ...base.fns, ...updated.fns, ...idsRewrittenData.fns },
      selectors: {
        ...base.selectors,
        ...updated.selectors,
        ...idsRewrittenData.selectors,
      },
      specs: {
        ...base.specs,
        ...updated.specs,
        ...idsRewrittenData.specs,
      },
      variables: {
        ...base.variables,
        ...updated.variables,
        ...idsRewrittenData.variables,
      },
    };
  }
}
