import { Action } from '../features/model/action/action';
import { Command } from '../features/model/command/command';
import { Context } from '../features/model/context/context';
import { RoleKey } from '../features/model/role-key/role-key';
import { SelectorDTO } from '../features/model/selector/data/selector-dto';
import { SpecDTO } from '../features/model/spec/data/spec-dto';
import { VariableDTO } from '../features/model/variable/data/variable-dto';

export type SleightDataFormat = {
  readonly version: string;
  //
  readonly actions: Readonly<Action[]>;
  readonly commands: Readonly<Command[]>;
  readonly contexts: Readonly<Context[]>;
  readonly roleKeys: Readonly<RoleKey[]>;
  readonly selectors: Readonly<SelectorDTO[]>;
  readonly specs: Readonly<SpecDTO[]>;
  readonly variables: Readonly<VariableDTO[]>;
};
