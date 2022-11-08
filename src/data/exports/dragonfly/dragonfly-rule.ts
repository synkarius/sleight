import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { VariableDTO } from '../../model/variable/variable-dto';

export type DragonflyRule = {
  contextName: string;
  context?: Context;
  commands: Command[];
  variables: VariableDTO[];
};
