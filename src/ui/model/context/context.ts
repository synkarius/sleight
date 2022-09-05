import { getRandomId } from '../../../common/random-id';
import {
  RoleKeyed,
  Ided,
  Named,
  Typed,
  Enablable,
  Lockable,
} from '../../domain';
import { ContextType } from './context-types';

export interface Context
  extends Enablable,
    Ided,
    Lockable,
    Named,
    RoleKeyed,
    Typed<ContextType.Type> {
  // "Gmail" (window-title-match), "chrome.exe" (executable-name-match)
  readonly matcher: string;
}

export const createContext = (): Context => {
  return {
    id: getRandomId(),
    name: '',
    roleKey: '',
    enabled: true,
    locked: false,
    type: ContextType.Enum.EXECUTABLE_NAME,
    matcher: '',
  };
};
