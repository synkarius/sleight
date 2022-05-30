export interface ApiKeyed {
    apiKey: string | null
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

interface BasicFields extends ApiKeyed, Ided, Named, Typed {}

interface IdentifyingFields extends ApiKeyed, Named, Ided {}

export type Identifiable = IdentifyingFields | null;

export const createVariable = (type:string):BasicFields => {
    return {
        apiKey: null,
        id: crypto.randomUUID(),
        name: '',
        type: type
    };
}

export const copyVariable = (variable:BasicFields):BasicFields => {
    return {
        apiKey: variable.apiKey,
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