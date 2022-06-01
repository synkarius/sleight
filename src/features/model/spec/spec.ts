import { getRandomId } from '../../../util/functions';
import { Ided, Named, RoleKeyed, Typed } from "../../domain";

export class SpecItemType {
    static readonly SELECTOR = "Selector";
    static readonly VARIABLE = "Variable";
    static readonly values = () => [SpecItemType.SELECTOR, SpecItemType.VARIABLE];
};

export interface SpecItem extends Ided {
    itemId: string
    itemType:string
}

export const createSpecItem = (itemId:string, itemType:string):SpecItem => {
    return {
        id: getRandomId(),
        itemId: itemId,
        itemType: itemType
    }
}

export interface Spec extends Named, Ided, RoleKeyed {
    items: SpecItem[]
}

export const createSpec = (selectorId:string) => {
    return {
        id: getRandomId(),
        name: '',
        roleKeyId: null,
        items: [createSpecItem(selectorId, SpecItemType.SELECTOR)]
    }
}