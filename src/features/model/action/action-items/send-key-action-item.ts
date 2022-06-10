import { Typed } from '../../../domain';
import { ActionItem } from '../action';

// hardcoded for now, if this can be tied to a variable, have to rework it
export interface Modifiers {
    control:boolean,
    alt:boolean,
    shift:boolean,
    windows:boolean
}

/*
 * Note:
 * - you should be able to EITHER hard code all the key properties or attach them to variables
 *
 */

// indicates whether a value should refer to an id or a hardcoded value
export interface MaybeIded extends Typed {
    ided:boolean
}

export interface TextValue extends MaybeIded {
    textVariableId:string|null,
    value:string|null
}

export interface RangeValue extends MaybeIded {
    rangeVariableId:string|null,
    value:number|null
}

export interface ChoiceValue extends MaybeIded {
    choiceVariableId:string|null,
    value:string|null
}

export interface SendKeyActionItem extends ActionItem {
    // see send-key-modes.ts for options -- whether a press or a hold/release
    sendKeyMode:string,
    // TODO: fix this -- needs to be hardcode-able (might ONLY be hardcode-able, check w/ L)
    modifiers:Modifiers,
    // TODO: enforce that this has roleKey:alphabet if using a choice var??
    keypress:ChoiceValue,
    outerPause:RangeValue
}

export interface SendKeyPressActionItem extends SendKeyActionItem {
    innerPause:RangeValue,
    repeat:RangeValue
}

export interface SendKeyHoldReleaseActionItem extends SendKeyActionItem {
    direction:ChoiceValue
}