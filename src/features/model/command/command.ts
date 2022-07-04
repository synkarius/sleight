import { getRandomId } from '../../../util/functions';
import { RoleKeyed, Named, Ided } from "../../domain";
import { CommandSpecType } from './command-spec-type';

export interface Command extends Ided, Named, RoleKeyed {
    specId: string|null;
    specRoleKeyId: string|null;
    commandSpecType: string;
    actionIds:string[]
}

export const createCommand = ():Command => {
    return {
        id: getRandomId(),
        name: "",
        roleKeyId: null,
        specId: null,
        specRoleKeyId: null,
        commandSpecType: CommandSpecType.SPEC,
        actionIds: []
    }
}