import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Named, Ided } from '../../domain';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

export interface Command extends Ided, Named, RoleKeyed {
  readonly specId: string;
  readonly actionIds: string[];
  readonly contextId?: string;
}

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKey: '',
    contextId: undefined,
    specId: SELECT_DEFAULT_VALUE,
    actionIds: [],
  };
};

// export const copyCommand = (
//   command: Command
// ): Omit<Command, 'specId'> => {
//   const { id, name, roleKey, contextId, specType, actionIds } = command;
//   return { id, name, roleKey, contextId, specType, actionIds };
// };
