import { ApiKeyed, copyVariable, createVariable, Ided, Named, Typed } from "../../../domain";
import { VariableType } from '../extra-types';

interface RangeCompatible extends ApiKeyed, Named, Ided, Typed {}
const BEGIN_INCLUSIVE_DEFAULT = 0;
const END_INCLUSIVE_DEFAULT = 9;

export interface Range extends ApiKeyed, Named, Ided, Typed {
    beginInclusive: number,
    endInclusive: number
}

export const createRange = ():Range => {
    return {
        ...createVariable(VariableType.RANGE),
        beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
        endInclusive: END_INCLUSIVE_DEFAULT
    };
}

export const copyIntoRange = (variable:RangeCompatible):Range => {
    return {
        ...copyVariable(variable),
        type: VariableType.RANGE,
        beginInclusive: BEGIN_INCLUSIVE_DEFAULT,
        endInclusive: END_INCLUSIVE_DEFAULT
    }
}