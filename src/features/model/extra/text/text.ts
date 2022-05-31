import { 
    ApiKeyed, 
    copyVariable, 
    createVariable, 
    Ided, 
    Named, 
    Typed } from "../../../domain";
import { VariableType } from '../extra-types';

export interface Text extends ApiKeyed, Named, Ided, Typed {
}

interface TextCompatible extends ApiKeyed, Named, Ided, Typed {}

export const createText = ():Text => {
    return {
        ...createVariable(VariableType.TEXT)
    };
}

export const copyIntoText = (variable: TextCompatible):Text => {
    return {
        ...copyVariable(variable),
        type: VariableType.TEXT
    }
}