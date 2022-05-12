import { abstractCreateExtra, ApiKeyed, Ided, Identifiable, Named, Typed } from "../../../domain";
import { VariableType } from '../extra-types';

export interface Range extends ApiKeyed, Named, Ided, Typed {
    beginInclusive: number,
    endInclusive: number
}

export const createRange = (beginInclusive: number, endInclusive: number, from:Identifiable=null):Range => {
    return {
        ...abstractCreateExtra(VariableType.RANGE, from),
        beginInclusive: beginInclusive,
        endInclusive: endInclusive
    };
}