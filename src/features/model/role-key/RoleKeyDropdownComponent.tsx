import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

export const RoleKeyDropdownComponent: React.FC<{
  roleKeyId: string | null;
  payloadFn: (selectedRoleKeyId: string) => PayloadAction<string>;
}> = (props) => {
  const dispatch = useAppDispatch();
  const roleKeys = useAppSelector((state) => state.roleKey.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(props.payloadFn(event.target.value));
  };
  return (
    <FormSelect
      aria-label="role key selection"
      onChange={selectedChangedHandler}
      value={props.roleKeyId || ''}
    >
      <option value={SELECT_DEFAULT_VALUE}></option>
      {Object.values(roleKeys).map((roleKey) => (
        <option key={roleKey.id} value={roleKey.id}>
          {roleKey.value}
        </option>
      ))}
    </FormSelect>
  );
};
