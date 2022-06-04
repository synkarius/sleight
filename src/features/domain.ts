import { getRandomId } from '../util/functions';

export interface RoleKeyed {
    roleKeyId: string | null
}

export interface Ided {
    id: string
}

export interface Named {
    name: string
}

export interface Typed {
    type: string
}

interface BasicFields extends RoleKeyed, Ided, Named, Typed {}

interface IdentifyingFields extends RoleKeyed, Named, Ided {}

export type Identifiable = IdentifyingFields | null;

export const createVariable = (type:string):BasicFields => {
    return {
        roleKeyId: null,
        id: getRandomId(),
        name: '',
        type: type
    };
}

export const copyVariable = (variable:BasicFields):BasicFields => {
    return {
        roleKeyId: variable.roleKeyId,
        id: variable.id,
        name: variable.name,
        type: variable.type
    };
}