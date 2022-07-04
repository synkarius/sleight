import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

export const SpecDropdownComponent: React.FC<{
  specId: string | null;
  payloadFn: (selectedSpecId: string) => PayloadAction<string>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const specs = useAppSelector((state) => state.spec.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(props.payloadFn(event.target.value));
  };
  return (
    <FormSelect
      aria-label="spec selection"
      onChange={selectedChangedHandler}
      value={props.specId || ''}
    >
      <option value="none"></option>
      {Object.values(specs).map((spec) => (
        <option key={spec.id} value={spec.id}>
          {spec.name}
        </option>
      ))}
    </FormSelect>
  );
};
