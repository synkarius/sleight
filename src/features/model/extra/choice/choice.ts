import { ApiKeyed, copyVariable, createVariable, Ided, Named, Typed } from "../../../domain";
import { VariableType } from '../extra-types';

interface ChoiceCompatible extends ApiKeyed, Named, Ided, Typed {}

export interface ChoiceItem extends ApiKeyed, Ided {
    selectorId: string,
    value: string
}

export const createChoiceItem = (selectorId:string):ChoiceItem => {
    return {
        apiKey: null,
        id: crypto.randomUUID(),
        selectorId: selectorId,
        value: ''
    };
}

export interface Choice extends ApiKeyed, Named, Ided, Typed {
    items: ChoiceItem[]
}

export const createChoice = (selectorId:string):Choice => {
    return {
        ...createVariable(VariableType.CHOICE),
        items: [createChoiceItem(selectorId)]
    };
}

export const copyIntoChoice = (variable:ChoiceCompatible, selectorId:string):Choice => {
    return {
        ...copyVariable(variable),
        type: VariableType.CHOICE,
        items: [createChoiceItem(selectorId)]
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

export type ChangeVariableTypePayload = {
    variableType: string
    selectorId: string | null
}