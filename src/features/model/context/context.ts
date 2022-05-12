import { ApiKeyed, Named } from "../../domain";

// TODO: can I constrain the values of "type"?:
export interface Context extends ApiKeyed, Named {
    // window-title-match, executable-name-match
    type: string,
    // "Gmail", "chrome.exe"
    selector: string
}