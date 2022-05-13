import { abstractCreateExtra, ApiKeyed, Ided, Identifiable, Named, Typed } from "../../domain";
import { ContextType } from './context-types';

export interface Context extends ApiKeyed, Ided, Named, Typed {
    // "Gmail" (window-title-match), "chrome.exe" (executable-name-match)
    selector: string
}

export const createContext = (selector:string, from:Identifiable = null):Context => {
    return {
        ...abstractCreateExtra(ContextType.EXECUTABLE_NAME, from),
        selector: selector
    };
}