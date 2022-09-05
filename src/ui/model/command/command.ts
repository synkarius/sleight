import { getRandomId } from '../../../common/random-id';
import { RoleKeyed, Named, Ided, Enablable, Lockable } from '../../domain';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';

export interface Command extends Enablable, Ided, Lockable, Named, RoleKeyed {
  readonly specId: string;
  readonly actionIds: string[];
  readonly contextId?: string;
}

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKey: '',
    enabled: true,
    locked: false,
    contextId: undefined,
    specId: SELECT_DEFAULT_VALUE,
    actionIds: [],
  };
};
