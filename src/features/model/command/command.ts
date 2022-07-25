import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Named, Ided } from '../../domain';
import { CommandSpecType } from './command-spec-type';

export interface Command extends Ided, Named, RoleKeyed {
  specType: CommandSpecType.Type;
  specVariableId: string | undefined;
  specRoleKeyId: string | undefined;
  actionIds: string[];
}

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: null,
    specType: CommandSpecType.Enum.VARIABLE,
    specVariableId: undefined,
    specRoleKeyId: undefined,
    actionIds: [],
  };
};
