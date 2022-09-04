import { Action } from '../ui/model/action/action';
import { Command } from '../ui/model/command/command';
import { Context } from '../ui/model/context/context';
import { SelectorDTO } from '../ui/model/selector/data/selector-dto';
import { SpecDTO } from '../ui/model/spec/data/spec-dto';
import { VariableDTO } from '../ui/model/variable/data/variable-dto';

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
