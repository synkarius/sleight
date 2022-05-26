import { 
    abstractCreateExtra, 
    ApiKeyed, 
    Ided, 
    Identifiable, 
    Named, 
    Typed } from "../../../domain";
import { Selected, Selector } from '../../selector/selector';
import { VariableType } from '../extra-types';

export interface Text extends ApiKeyed, Named, Ided, Typed, Selected {
}

export const createText = (selector:Selector, from:Identifiable = null):Text => {
    return {
        ...abstractCreateExtra(VariableType.TEXT, from),
        selector: selector
    };
}