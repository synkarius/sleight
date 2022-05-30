import { 
    ApiKeyed, 
    copyVariable, 
    createVariable, 
    Ided, 
    Named, 
    Typed } from "../../../domain";
import { Selected } from '../../selector/selector';
import { VariableType } from '../extra-types';

export interface Text extends ApiKeyed, Named, Ided, Typed, Selected {
}

interface TextCompatible extends ApiKeyed, Named, Ided, Typed {}

export const createText = ():Text => {
    return {
        ...createVariable(VariableType.TEXT),
        selectorIds: []
    };
}

export const copyIntoText = (variable: TextCompatible):Text => {
    return {
        ...copyVariable(variable),
        type: VariableType.TEXT,
        selectorIds: []
    }
}