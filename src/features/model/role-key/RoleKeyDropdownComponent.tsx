import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type RoleKeyDropdownComponentProps = {
  roleKeyId: string | null;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
  name?: string;
};

export const RoleKeyDropdownComponent: React.FC<
  RoleKeyDropdownComponentProps
> = (props) => {
  const roleKeys = useAppSelector((state) => state.roleKey.saved);

  return (
    <FormSelect
      value={props.roleKeyId || SELECT_DEFAULT_VALUE}
      aria-label={props.name}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={SELECT_DEFAULT_VALUE} role="listitem"></option>
      {Object.values(roleKeys).map((roleKey) => (
        <option key={roleKey.id} value={roleKey.id} role="listitem">
          {roleKey.value}
        </option>
      ))}
    </FormSelect>
  );
};
