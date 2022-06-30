import { PayloadAction } from '@reduxjs/toolkit';
import React, { useId } from 'react';
import { FormCheck } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { ActionValue } from './action-value';
import { ActionValueType } from './action-value-type';

export const ActionValueTypeRadioGroupComponent: React.FC<{
  actionValue: ActionValue;
  radioGroupName: string;
  typeChangedFn: (newType: string) => PayloadAction<string>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();

  const radioButtonData = [
    { id: id1, type: ActionValueType.ENTER_VALUE },
    { id: id2, type: ActionValueType.USE_VARIABLE },
    { id: id3, type: ActionValueType.USE_ROLE_KEY },
  ];
  return (
    <div>
      {radioButtonData.map((d) => (
        <FormCheck
          inline
          label={d.type}
          name={props.radioGroupName + ' radio group'}
          type="radio"
          id={d.id}
          key={d.type}
          checked={props.actionValue.actionValueType === d.type}
          onChange={(_e) => dispatch(props.typeChangedFn(d.type))}
        />
      ))}
    </div>
  );
};
