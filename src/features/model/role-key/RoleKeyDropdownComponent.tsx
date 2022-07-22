import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type RoleKeyDropdownComponentProps = {
  roleKeyId: string | null;
  field: Field;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
};

export const RoleKeyDropdownComponent: React.FC<
  RoleKeyDropdownComponentProps
> = (props) => {
  const roleKeysSaved = useAppSelector((state) => state.roleKey.saved);

  return (
    <FormSelect
      value={props.roleKeyId || SELECT_DEFAULT_VALUE}
      aria-label={Field[props.field]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={SELECT_DEFAULT_VALUE} role="listitem"></option>
      {Object.values(roleKeysSaved).map((roleKey) => (
        <option key={roleKey.id} value={roleKey.id} role="listitem">
          {roleKey.value}
        </option>
      ))}
    </FormSelect>
  );
};
