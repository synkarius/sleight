import { getDefaultInjectionContext } from '../di/app-default-injection-context';
import { Action } from './model/action/action';
import { Command } from './model/command/command';
import { Context } from './model/context/context';
import { Ided } from './model/domain';
import { SelectorDTO } from './model/selector/selector-dto';
import { SpecDTO } from './model/spec/spec-dto';
import { VariableDTO } from './model/variable/variable-dto';

type SleightDataArrays = {
  readonly actions: Readonly<Action[]>;
  readonly commands: Readonly<Command[]>;
  readonly contexts: Readonly<Context[]>;
  readonly selectors: Readonly<SelectorDTO[]>;
  readonly specs: Readonly<SpecDTO[]>;
  readonly variables: Readonly<VariableDTO[]>;
};

export type SleightDataExportFormat = SleightDataArrays & {
  readonly version: string;
};

export type SleightDataInternalFormat = {
  readonly actions: Readonly<Record<string, Action>>;
  readonly commands: Readonly<Record<string, Command>>;
  readonly contexts: Readonly<Record<string, Context>>;
  readonly selectors: Readonly<Record<string, SelectorDTO>>;
  readonly specs: Readonly<Record<string, SpecDTO>>;
  readonly variables: Readonly<Record<string, VariableDTO>>;
};

export const convertSleightInternalFormatToKeys = (
  data: SleightDataInternalFormat
) => {
  return {
    actions: Object.values(data.actions),
    commands: Object.values(data.commands),
    contexts: Object.values(data.contexts),
    selectors: Object.values(data.selectors),
    specs: Object.values(data.specs),
    variables: Object.values(data.variables),
  };
};

const reduceIded = <T extends Ided>(record: Record<string, T>, ided: T) => ({
  ...record,
  [ided.id]: ided,
});

export const convertSleightExternalFormatToInternal = (
  external: Omit<SleightDataExportFormat, 'version'>
): SleightDataInternalFormat => {
  const result: SleightDataInternalFormat = {
    actions: external.actions.reduce(reduceIded, {}),
    commands: external.commands.reduce(reduceIded, {}),
    contexts: external.contexts.reduce(reduceIded, {}),
    selectors: external.selectors.reduce(reduceIded, {}),
    specs: external.specs.reduce(reduceIded, {}),
    variables: external.variables.reduce(reduceIded, {}),
  };
  return result;
};

export const merge = (
  base: SleightDataInternalFormat,
  override: SleightDataInternalFormat
): SleightDataInternalFormat => {
  return {
    ...base,
    ...override,
  };
};

/** Clean data -- should remove values not in format. */
export const cleanData = (
  data: SleightDataInternalFormat
): SleightDataInternalFormat => {
  // convert records to arrays
  const arrays: SleightDataArrays = convertSleightInternalFormatToKeys(data);
  // clean data
  const injected = getDefaultInjectionContext();
  const cleaners = injected.cleaners;
  const cleanedValues: SleightDataArrays = {
    actions: cleaners.action.clean(arrays.actions),
    commands: cleaners.command.clean(arrays.commands),
    contexts: cleaners.context.clean(arrays.contexts),
    selectors: cleaners.selector.clean(arrays.selectors),
    specs: cleaners.spec.clean(arrays.specs),
    variables: cleaners.variable.clean(arrays.variables),
  };
  // convert back to internal format
  const internalFormat = convertSleightExternalFormatToInternal(cleanedValues);
  return internalFormat;
};
