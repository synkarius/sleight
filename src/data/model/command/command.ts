import { getRandomId } from '../../../core/common/random-id';
import { RoleKeyed, Named, Ided, Enablable, Lockable } from '../domain';
import { UNSELECTED_ID } from '../../../core/common/consts';

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
    specId: UNSELECTED_ID,
    actionIds: [],
  };
};
