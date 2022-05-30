import { ApiKeyed, copyVariable, createVariable, Ided, Named, Typed } from "../../../domain";
import { Selected } from '../../selector/selector';
import { VariableType } from '../extra-types';

interface ChoiceCompatible extends ApiKeyed, Named, Ided, Typed {}

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

export interface Choice extends ApiKeyed, Named, Ided, Typed, Selected {
    items: ChoiceItem[]
}

export const createChoice = ():Choice => {
    return {
        ...createVariable(VariableType.CHOICE),
        items: [createChoiceItem()],
        selectorIds: []
    };
}

export const copyIntoChoice = (variable:ChoiceCompatible):Choice => {
    return {
        ...copyVariable(variable),
        type: VariableType.CHOICE,
        items: [createChoiceItem()],
        selectorIds: []
    }
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