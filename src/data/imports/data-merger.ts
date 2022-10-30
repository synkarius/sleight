import { SleightDataInternalFormat } from '../data-formats';

export type SleightDataMerger = {
  merge: (
    a: SleightDataInternalFormat,
    b: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export class SpreadingDataMerger implements SleightDataMerger {
  merge(
    a: SleightDataInternalFormat,
    b: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      actions: {
        ...a.actions,
        ...b.actions,
      },
      commands: {
        ...a.commands,
        ...b.commands,
      },
      contexts: {
        ...a.contexts,
        ...b.contexts,
      },
      fns: { ...a.fns, ...b.fns },
      selectors: {
        ...a.selectors,
        ...b.selectors,
      },
      specs: {
        ...a.specs,
        ...b.specs,
      },
      variables: {
        ...a.variables,
        ...b.variables,
      },
    };
  }
}
