import { SleightDataInternalFormat } from '../../data/data-formats';
import { Command } from '../../features/model/command/command';
import { Context } from '../../features/model/context/context';

/**
 * Adds the Sleight element currently being edited to a copy of Redux's
 * data so that a function which validates "all" data can validate
 * the edited object. This allows such an all-validating function to be
 * reused across Redux slices.
 */
export type DataTransformFunction<T> = (
  t: T,
  data: SleightDataInternalFormat
) => SleightDataInternalFormat;

const emptyData: SleightDataInternalFormat = {
  actions: {},
  commands: {},
  contexts: {},
  roleKeys: {},
  selectors: {},
  specs: {},
  variables: {},
};

export const retainActionsSpecsAndSingleCommand: DataTransformFunction<
  Command
> = (editing, data) => {
  return {
    ...emptyData,
    actions: structuredClone(data.actions),
    specs: structuredClone(data.specs),
    commands: { [editing.id]: editing },
  };
};
