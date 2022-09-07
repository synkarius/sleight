import { RoleKeyed, Named, Ided, Typed, Enablable, Lockable } from '../domain';
import { ActionType } from './action-types';

export interface AbstractAction
  extends Enablable,
    Ided,
    Lockable,
    Named,
    Typed<ActionType.Type>,
    RoleKeyed {}

export const copyAction = <T extends AbstractAction>(action: T) => {
  return {
    id: action.id,
    name: action.name,
    type: action.type,
    roleKey: action.roleKey,
    enabled: action.enabled,
    locked: action.locked,
  };
};
