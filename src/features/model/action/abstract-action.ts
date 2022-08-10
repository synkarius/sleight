import { RoleKeyed, Named, Ided, Typed } from '../../domain';
import { ActionType } from './action-types';

export interface AbstractAction
  extends Ided,
    Named,
    Typed<ActionType.Type>,
    RoleKeyed {}

export const copyAction = (action: AbstractAction) => {
  return {
    id: action.id,
    name: action.name,
    type: action.type,
    roleKeyId: action.roleKeyId,
  };
};
