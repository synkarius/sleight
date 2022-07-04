import { VariableType } from '../../variable/variable-types'
import { ActionValueType } from './action-value-type'

export interface ActionValue {
    /* this is how the user specifies the value in an action:
     * a value of ActionValueType
     */
    actionValueType:string
}

interface VariableActionValue {
    // if the user has chosen variable binding, this is the variable type
    variableType: string
    // if the user has chosen variable binding, this is the variable id
    variableId: string|null
}

interface RoleKeyActionValue {
    // if the user has chosen role key binding, this is the role key id
    roleKeyId: string|null
}

export interface TextValue extends ActionValue, VariableActionValue, RoleKeyActionValue {
    value:string|null
}

export const createTextValue = ():TextValue => {
    return {
        actionValueType: ActionValueType.ENTER_VALUE,
        variableType: VariableType.TEXT,
        variableId: null,
        roleKeyId: null,
        value: ""
    };
}

export interface RangeValue extends ActionValue, VariableActionValue, RoleKeyActionValue {
    value:number|null
}

export const createRangeValue = ():RangeValue => {
    return {
        actionValueType: ActionValueType.ENTER_VALUE,
        variableType: VariableType.RANGE,
        variableId: null,
        roleKeyId: null,
        value: 0
    };
}

export interface ChoiceValue extends ActionValue, VariableActionValue, RoleKeyActionValue {
    value:string|null
}

export const createChoiceValue = ():ChoiceValue => {
    return {
        actionValueType: ActionValueType.ENTER_VALUE,
        variableType: VariableType.CHOICE,
        variableId: null,
        roleKeyId: null,
        value: ""
    };
}