import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ChangeActionIdPayload } from '../command/command';

export const ActionDropdownComponent: React.FC<{
  actionId: string | null;
  selectedChangedFn: (
    selectedActionId: string
  ) => PayloadAction<ChangeActionIdPayload>;
  deletedFn: () => PayloadAction<number>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const actions = useAppSelector((state) => state.action.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(props.selectedChangedFn(event.target.value));
  };
  const deletedHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(props.deletedFn());
  };

  return (
    <FormSelect
      aria-label="action selection"
      onChange={selectedChangedHandler}
      value={props.actionId || ''}
    >
      <option value="none"></option>
      {Object.values(actions).map((action) => (
        <option key={action.id} value={action.id}>
          {action.name}
        </option>
      ))}
    </FormSelect>
  );
};
