import { getRandomId } from '../../../common/random-id';
import { RoleKeyed, Ided, Named, Typed } from '../../domain';
import { ContextType } from './context-types';

export interface Context
  extends RoleKeyed,
    Ided,
    Named,
    Typed<ContextType.Type> {
  // "Gmail" (window-title-match), "chrome.exe" (executable-name-match)
  readonly matcher: string;
}

export const createContext = (): Context => {
  return {
    id: getRandomId(),
    name: '',
    roleKey: '',
    type: ContextType.Enum.EXECUTABLE_NAME,
    matcher: '',
  };
};
