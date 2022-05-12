import { abstractCreateExtra, ApiKeyed, Ided, Identifiable, Named, Typed } from "../../../domain";
import { VariableType } from '../extra-types';

export interface ChoiceItem extends ApiKeyed, Ided {
    selector: string,
    value: string
}

export const createChoiceItem = ():ChoiceItem => {
    return {
        apiKey: null,
        id: crypto.randomUUID(),
        selector: '',
        value: ''
    };
}

export interface Choice extends ApiKeyed, Named, Ided, Typed {
    items: ChoiceItem[]
}

export const createChoice = (items:ChoiceItem[], from:Identifiable=null):Choice => {
    return {
        ...abstractCreateExtra(VariableType.CHOICE, from),
        items: items
    };
}

export type EditChoiceItemSelectorPayload = {
    choiceItemId: string,
    selector: string
}

export type EditChoiceItemValuePayload = {
    choiceItemId: string,
    value: string
}

export type RemoveChoiceItemPayload = {
    choiceItemId: string
}