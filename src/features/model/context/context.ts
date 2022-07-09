import { getRandomId } from '../../../util/random-id';
import { RoleKeyed, Ided, Named, Typed } from '../../domain';
import { ContextType } from './context-types';

export interface Context extends RoleKeyed, Ided, Named, Typed {
  // "Gmail" (window-title-match), "chrome.exe" (executable-name-match)
  matcher: string;
}

export const createContext = (): Context => {
  return {
    roleKeyId: null,
    id: getRandomId(),
    name: '',
    type: ContextType.EXECUTABLE_NAME,
    matcher: '',
  };
};
