import { RoleKeyed, Named, Ided, Typed } from "../../domain";

export interface Action extends Ided, Named, Typed, RoleKeyed {}

export type ChangeActionTypePayload = {
    actionType:string
}

export type ChangeSendKeyModePayload = {
    sendKeyMode:string
}