import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type RoleKeyDropdownComponentProps = {
  roleKeyId: string | null;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
};

export const RoleKeyDropdownComponent: React.FC<
  RoleKeyDropdownComponentProps
> = (props) => {
  const roleKeys = useAppSelector((state) => state.roleKey.saved);

  return (
    <FormSelect
      aria-label="role key selection"
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.roleKeyId || SELECT_DEFAULT_VALUE}
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
