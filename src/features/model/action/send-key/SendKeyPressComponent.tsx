import React from 'react';
import { useDispatch } from 'react-redux';
import {
  changeInnerPauseValue,
  changeInnerPauseVariableId,
  changeRepeatValue,
  changeRepeatVariableId,
  toggleInnerPauseIded,
  toggleRepeatIded,
} from '../action-reducers';
import { RangeValueComponent } from '../action-value/RangeValueComponent';
import { SendKeyPressAction } from './send-key';

export const SendKeyPressComponent: React.FC<{
  sendKeyPressAction: SendKeyPressAction;
}> = (props) => {
  const dispatch = useDispatch();

  return (
    <>
      <RangeValueComponent
        labelText="Inner Pause"
        rangeValue={props.sendKeyPressAction.innerPause}
        idedChangedFn={(_e) => dispatch(toggleInnerPauseIded())}
        valueChangedFn={(e) => dispatch(changeInnerPauseValue(e.target.value))}
        variableIdChangedFn={(id) => changeInnerPauseVariableId(id)}
      />
      <RangeValueComponent
        labelText="Repeat"
        rangeValue={props.sendKeyPressAction.repeat}
        idedChangedFn={(_e) => dispatch(toggleRepeatIded())}
        valueChangedFn={(e) => dispatch(changeRepeatValue(e.target.value))}
        variableIdChangedFn={(id) => changeRepeatVariableId(id)}
      />
    </>
  );
};
