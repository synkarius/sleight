import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Named, Ided } from '../../domain';
import { CommandSpecType } from './command-spec-type';

export interface Command extends Ided, Named, RoleKeyed {
  contextId: string | undefined;
  specType: CommandSpecType.Type;
  specVariableId: string | undefined;
  specRoleKeyId: string | undefined;
  actionIds: string[];
}

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: undefined,
    contextId: undefined,
    specType: CommandSpecType.Enum.SPEC,
    specVariableId: undefined,
    specRoleKeyId: undefined,
    actionIds: [],
  };
};
