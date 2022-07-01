import { RoleKeyed, Named, Ided, Typed } from "../../domain";

export interface Action extends Ided, Named, Typed, RoleKeyed {}

export const copyAction = (action:Action) => {
    return {
        id: action.id,
        name: action.name,
        type: action.type,
        roleKeyId: action.roleKeyId
    };
}

export type ChangeActionTypePayload = {
    actionType:string
}

export type ChangeSendKeyModePayload = {
    sendKeyMode:string
}

