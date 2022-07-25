import { RoleKeyed, Named, Ided, Typed } from '../../domain';
import { ActionType } from './action-types';

export interface Action
  extends Ided,
    Named,
    Typed<ActionType.Type>,
    RoleKeyed {}

export const copyAction = (action: Action) => {
  return {
    id: action.id,
    name: action.name,
    type: action.type,
    roleKeyId: action.roleKeyId,
  };
};
