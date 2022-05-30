import { ApiKeyed, Ided, Named, Typed } from "../../domain";
import { ContextType } from './context-types';

export interface Context extends ApiKeyed, Ided, Named, Typed {
    // "Gmail" (window-title-match), "chrome.exe" (executable-name-match)
    matcher: string
}

export const createContext = ():Context => {
    return {
        apiKey: null,
        id: crypto.randomUUID(),
        name: '',
        type: ContextType.EXECUTABLE_NAME,
        matcher: ''
    };
}