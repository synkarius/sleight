import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Named, Ided } from '../../domain';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { CommandSpecType } from './command-spec-type';

interface AbstractCommand extends Ided, Named, RoleKeyed {
  readonly specType: CommandSpecType.Type;
  readonly contextId?: string;
  readonly actionIds: string[];
}

interface SelectedSpecCommand extends AbstractCommand {
  readonly specType: typeof CommandSpecType.Enum.SPEC;
  readonly specId: string;
}

export const isSelectedSpecCommand = (
  command: AbstractCommand
): command is SelectedSpecCommand =>
  command.specType === CommandSpecType.Enum.SPEC;

interface RoleKeyedSpecCommand extends AbstractCommand {
  readonly specType: typeof CommandSpecType.Enum.ROLE_KEY;
  readonly specRoleKeyId: string;
}

export const isRoleKeyedSpecCommand = (
  command: AbstractCommand
): command is RoleKeyedSpecCommand =>
  command.specType === CommandSpecType.Enum.ROLE_KEY;

export type Command = SelectedSpecCommand | RoleKeyedSpecCommand;

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: undefined,
    contextId: undefined,
    specType: CommandSpecType.Enum.SPEC,
    specId: SELECT_DEFAULT_VALUE,
    actionIds: [],
  };
};

export const copyCommand = (
  command: Command
): Omit<Command, 'specId' | 'specRoleKeyId'> => {
  const { id, name, roleKeyId, contextId, specType, actionIds } = command;
  return { id, name, roleKeyId, contextId, specType, actionIds };
};
