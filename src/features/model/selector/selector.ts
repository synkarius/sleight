import { ApiKeyed, Ided } from '../../domain';

interface BasicIded extends ApiKeyed, Ided {}

export interface SelectorItem extends ApiKeyed, Ided {
    value: string
}

export interface Selector extends ApiKeyed, Ided {
    items: SelectorItem[]
}

export interface Selected {
    selectorIds: string[]
}

export const createSelectorItem = ():SelectorItem => {
    return {
        apiKey: null,
        id: crypto.randomUUID(),
        value: ''
    };
}

export const createSelector = (fromItems:SelectorItem[]|null=null, from:BasicIded|null=null):Selector => {
    const apiKey = from !== null ? from.apiKey : null;
    const id = from !== null ? from.id : crypto.randomUUID();
    const items = fromItems !== null ? fromItems : [createSelectorItem()];
    return {
        apiKey: apiKey,
        id: id,
        items: items
    };
}

export interface EditSelectorItemPayload {
    selectorId: string,
    selectorItemId: string,
    value: string
}

export interface DeleteSelectorItemPayload {
    selectorId: string,
    selectorItemId: string
}