import { Action } from './model/action/action';
import { Command } from './model/command/command';
import { Context } from './model/context/context';
import { Fn } from './model/fn/fn';
import { SelectorDTO } from './model/selector/selector-dto';
import { SpecDTO } from './model/spec/spec-dto';
import { VariableDTO } from './model/variable/variable-dto';

export type SleightDataArrays = {
  readonly actions: Readonly<Action[]>;
  readonly commands: Readonly<Command[]>;
  readonly contexts: Readonly<Context[]>;
  readonly fns: Readonly<Fn[]>;
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
  readonly fns: Readonly<Record<string, Fn>>;
  readonly selectors: Readonly<Record<string, SelectorDTO>>;
  readonly specs: Readonly<Record<string, SpecDTO>>;
  readonly variables: Readonly<Record<string, VariableDTO>>;
};

export const createSleightDataInternalFormat =
  (): SleightDataInternalFormat => ({
    actions: {},
    commands: {},
    contexts: {},
    fns: {},
    selectors: {},
    specs: {},
    variables: {},
  });
