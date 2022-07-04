import { PayloadAction } from '@reduxjs/toolkit';
import React, { useId } from 'react';
import { FormCheck } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { CommandSpecType } from './command-spec-type';

export const CommandSpecTypeRadioGroupComponent: React.FC<{
  commandSpecType: string;
  radioGroupName: string;
  typeChangedFn: (newType: string) => PayloadAction<string>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const id1 = useId();
  const id2 = useId();

  const radioButtonData = [
    { id: id1, type: CommandSpecType.SPEC },
    { id: id2, type: CommandSpecType.ROLE_KEY },
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
          checked={props.commandSpecType === d.type}
          onChange={(_e) => dispatch(props.typeChangedFn(d.type))}
        />
      ))}
    </div>
  );
};
