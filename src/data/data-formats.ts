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
