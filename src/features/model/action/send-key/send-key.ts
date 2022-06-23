import { Action } from '../action';
import { ChoiceValue, createChoiceValue, createRangeValue, RangeValue } from '../action-value/action-value';
import { SendKeyMode } from './send-key-modes';
import { getRandomId } from '../../../../util/functions';
import { ActionType } from '../action-types';

export interface Modifiers {
    control:boolean,
    alt:boolean,
    shift:boolean,
    windows:boolean
}

export const createModifiers = ():Modifiers => {
    return {
        control: false,
        alt: false,
        shift: false,
        windows: false
    };
}

/*
 * Note:
 * - you should be able to EITHER hard code all the key properties or attach them to variables
 *  - except for modifiers
 */

export interface SendKeyAction extends Action {
    // see send-key-modes.ts for options -- whether a press or a hold/release
    sendKeyMode:string,
    modifiers:Modifiers,
    // TODO: enforce that this has roleKey:alphabet if using a choice var??
    sendKey:ChoiceValue,
    outerPause:RangeValue
}

export interface SendKeyPressAction extends SendKeyAction {
    innerPause:RangeValue,
    repeat:RangeValue
}

export const createSendKeyPressAction = ():SendKeyPressAction => {
    return {
        id: getRandomId(),
        name: "",
        type: ActionType.SEND_KEY,
        roleKeyId: null,
        sendKeyMode: SendKeyMode.PRESS,
        modifiers: createModifiers(),
        sendKey: createChoiceValue(),
        outerPause: createRangeValue(),
        innerPause: createRangeValue(),
        repeat: createRangeValue()
    };
}

export interface SendKeyHoldReleaseAction extends SendKeyAction {
    direction:ChoiceValue
}

export const createSendKeyHoldReleaseAction = ():SendKeyHoldReleaseAction => {
    return {
        id: getRandomId(),
        name: "",
        type: ActionType.SEND_KEY,
        roleKeyId: null,
        sendKeyMode: SendKeyMode.HOLD_RELEASE,
        modifiers: createModifiers(),
        sendKey: createChoiceValue(),
        outerPause: createRangeValue(),
        direction: createChoiceValue()
    };
}