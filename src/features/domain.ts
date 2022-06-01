export interface RoleKeyed {
    roleKey: string | null
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
        roleKey: null,
        id: crypto.randomUUID(),
        name: '',
        type: type
    };
}

export const copyVariable = (variable:BasicFields):BasicFields => {
    return {
        roleKey: variable.roleKey,
        id: variable.id,
        name: variable.name,
        type: variable.type
    };
}

export const upsertIded = <T extends Ided>(arr:T[], item:T) => {
    return arr.findIndex(t => t.id === item.id) !== -1
        ? arr.map(i => i.id === item.id ? {...item} : i)
        : [...arr, {...item}];
}