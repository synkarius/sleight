import { getDefaultInjectionContext } from '../di/app-default-injection-context';
import { Action } from './model/action/action';
import { Command } from './model/command/command';
import { Context } from './model/context/context';
import { SelectorDTO } from './model/selector/selector-dto';
import { SpecDTO } from './model/spec/spec-dto';
import { VariableDTO } from './model/variable/variable-dto';

export type SleightDataExportFormat = {
  readonly version: string;
  //
  readonly actions: Readonly<Action[]>;
  readonly commands: Readonly<Command[]>;
  readonly contexts: Readonly<Context[]>;
  readonly selectors: Readonly<SelectorDTO[]>;
  readonly specs: Readonly<SpecDTO[]>;
  readonly variables: Readonly<VariableDTO[]>;
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

export const convertSleightExternalFormatToInternal = (
  external: Omit<SleightDataExportFormat, 'version'>
): SleightDataInternalFormat => {
  const result: SleightDataInternalFormat = {
    actions: external.actions.reduce((obj, i) => ({ ...obj, [i.id]: i }), {}),
    commands: external.commands.reduce((obj, i) => ({ ...obj, [i.id]: i }), {}),
    contexts: external.contexts.reduce((obj, i) => ({ ...obj, [i.id]: i }), {}),
    selectors: external.selectors.reduce((o, i) => ({ ...o, [i.id]: i }), {}),
    specs: external.specs.reduce((obj, i) => ({ ...obj, [i.id]: i }), {}),
    variables: external.variables.reduce((o, i) => ({ ...o, [i.id]: i }), {}),
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

/** Clean data by mapping back and forth -- should remove values not in format. */
export const cleanData = (
  data: SleightDataInternalFormat
): SleightDataInternalFormat => {
  const injected = getDefaultInjectionContext();
  const mappers = injected.mappers;
  // convert records to arrays
  const values: Omit<SleightDataExportFormat, 'version'> =
    convertSleightInternalFormatToKeys(data);
  // convert selectors early b/c other conversions depend on them
  const selectors = values.selectors
    .map((selector) => mappers.selector.mapToDomain(selector))
    .map((selector) => mappers.selector.mapFromDomain(selector));
  const selectorsRecord: Record<string, SelectorDTO> = selectors.reduce(
    (o, i) => ({ ...o, [i.id]: i }),
    {}
  );
  // map back and forth
  const cleanedValues: Omit<SleightDataExportFormat, 'version'> = {
    actions: values.actions
      .map((action) => mappers.action.mapToDomain(action))
      .map((action) => mappers.action.mapFromDomain(action)),
    commands: values.commands
      .map((command) => mappers.command.mapToDomain(command))
      .map((command) => mappers.command.mapFromDomain(command)),
    contexts: values.contexts
      .map((context) => mappers.context.mapToDomain(context))
      .map((context) => mappers.context.mapFromDomain(context)),
    selectors,
    specs: values.specs
      .map((spec) => mappers.spec.mapToDomain(spec, selectorsRecord))
      .map((spec) => mappers.spec.mapFromDomain(spec)),
    variables: values.variables
      .map((variable) =>
        mappers.variable.mapToDomain(variable, selectorsRecord)
      )
      .map((variable) => mappers.variable.mapFromDomain(variable)),
  };
  // convert back to internal format
  const internalFormat = convertSleightExternalFormatToInternal(cleanedValues);
  return internalFormat;
};
