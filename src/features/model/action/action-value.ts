import { Typed } from '../../domain'
import { VariableType } from '../extra/extra-types'

// indicates whether a value should refer to an id or a hardcoded value
// type is a Variable type
interface MaybeIded extends Typed {
    ided:boolean
}

export interface TextValue extends MaybeIded {
    textVariableId:string|null,
    value:string|null
}

export const createTextValue = ():TextValue => {
    return {
        type: VariableType.TEXT,
        ided: false,
        textVariableId: null,
        value: ""
    };
}

export interface RangeValue extends MaybeIded {
    rangeVariableId:string|null,
    value:number|null
}

export const createRangeValue = ():RangeValue => {
    return {
        type: VariableType.RANGE,
        ided: false,
        rangeVariableId: null,
        value: 0
    }
}

export interface ChoiceValue extends MaybeIded {
    choiceVariableId:string|null,
    value:string|null
}

export const createChoiceValue = ():ChoiceValue => {
    return {
        type: VariableType.CHOICE,
        ided: false,
        choiceVariableId: null,
        value: ""
    };
}