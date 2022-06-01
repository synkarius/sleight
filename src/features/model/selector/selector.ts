import { getRandomId } from '../../../util/functions';
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
        roleKeyId: null,
        id: getRandomId(),
        value: ''
    };
}

export const createSelector = (fromItems:SelectorItem[]|null=null, from:BasicIded|null=null):Selector => {
    const roleKeyId = from !== null ? from.roleKeyId : null;
    const id = from !== null ? from.id : getRandomId();
    const items = fromItems !== null ? fromItems : [createSelectorItem()];
    return {
        roleKeyId: roleKeyId,
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