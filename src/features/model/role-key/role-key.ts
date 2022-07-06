import { getRandomId } from '../../../util/functions';
import { Ided } from '../../domain';

export interface RoleKey extends Ided {
  value: string;
}

export const createRoleKey = (): RoleKey => {
  return {
    id: getRandomId(),
    value: '',
  };
};
