import { Action } from '../../features/model/action/action';
import { Command } from '../../features/model/command/command';
import { Context } from '../../features/model/context/context';
import { RoleKey } from '../../features/model/role-key/role-key';
import { SelectorDTO } from '../../features/model/selector/data/selector-dto';
import { SpecDTO } from '../../features/model/spec/data/spec-dto';
import { VariableDTO } from '../../features/model/variable/data/variable-dto';

export type Exporter = {
  export: (
    actions: Readonly<Record<string, Action>>,
    commands: Readonly<Record<string, Command>>,
    contexts: Readonly<Record<string, Context>>,
    roleKeys: Readonly<Record<string, RoleKey>>,
    selectors: Readonly<Record<string, SelectorDTO>>,
    specs: Readonly<Record<string, SpecDTO>>,
    variables: Readonly<Record<string, VariableDTO>>
  ) => string[];
};
