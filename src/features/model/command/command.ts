import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Named, Ided } from '../../domain';
import { MoveDirection } from '../common/move-direction';
import { CommandSpecType } from './command-spec-type';

export interface Command extends Ided, Named, RoleKeyed {
  commandSpecType: string;
  specId: string | null;
  specRoleKeyId: string | null;
  actionIds: string[];
}

export const createCommand = (): Command => {
  return {
    id: getRandomId(),
    name: '',
    roleKeyId: null,
    commandSpecType: CommandSpecType.SPEC,
    specId: null,
    specRoleKeyId: null,
    actionIds: [],
  };
};

export type ChangeActionIdPayload = {
  index: number;
  newActionId: string;
};

export type MoveCommandActionPayload = {
  index: number;
  direction: MoveDirection;
};
