import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ChangeActionIdPayload } from '../command/command';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

export const ActionDropdownComponent: React.FC<{
  actionId: string | null;
  selectedChangedFn: (
    selectedActionId: string
  ) => PayloadAction<ChangeActionIdPayload>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const actions = useAppSelector((state) => state.action.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(props.selectedChangedFn(event.target.value));
  };

  return (
    <FormSelect
      aria-label="action selection"
      onChange={selectedChangedHandler}
      value={props.actionId || ''}
    >
      <option value={SELECT_DEFAULT_VALUE}></option>
      {Object.values(actions).map((action) => (
        <option key={action.id} value={action.id}>
          {action.name}
        </option>
      ))}
    </FormSelect>
  );
};
