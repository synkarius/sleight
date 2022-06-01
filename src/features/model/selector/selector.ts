import { RoleKeyed, Ided } from '../../domain';

interface BasicIded extends RoleKeyed, Ided {}

export interface SelectorItem extends RoleKeyed, Ided {
    value: string
}

export interface Selector extends RoleKeyed, Ided {
    items: SelectorItem[]
}

export const createSelectorItem = ():SelectorItem => {
    return {
        roleKey: null,
        id: crypto.randomUUID(),
        value: ''
    };
}

export const createSelector = (fromItems:SelectorItem[]|null=null, from:BasicIded|null=null):Selector => {
    const roleKey = from !== null ? from.roleKey : null;
    const id = from !== null ? from.id : crypto.randomUUID();
    const items = fromItems !== null ? fromItems : [createSelectorItem()];
    return {
        roleKey: roleKey,
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