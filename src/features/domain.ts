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

export const abstractCreateExtra = (type:string, from:Identifiable=null):BasicFields => {
    const apiKey = from !== null ? from.apiKey : null;
    const id = from !== null ? from.id : crypto.randomUUID();
    const name = from !== null ? from.name : '';
    return {
        apiKey: apiKey,
        id: id,
        name: name,
        type: type
    };
}

export const upsertIded = <T extends Ided>(arr:T[], item:T) => {
    return arr.findIndex(t => t.id === item.id) !== -1
        ? arr.map(i => i.id === item.id ? {...item} : i)
        : [...arr, {...item}];
}