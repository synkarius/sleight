import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { LIST_ITEM } from '../common/accessibility-roles';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type ActionDropdownComponentProps = {
  readonly field: Field;
  readonly actionId?: string;
  readonly onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  readonly onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  readonly isInvalid?: boolean;
};

export const ActionDropdownComponent: React.FC<ActionDropdownComponentProps> = (
  props
) => {
  const actions = useAppSelector((state) => state.action.saved);

  return (
    <FormSelect
      value={props.actionId || SELECT_DEFAULT_VALUE}
      aria-label={Field[props.field]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={SELECT_DEFAULT_VALUE} role={LIST_ITEM}></option>
      {Object.values(actions).map((action) => (
        <option key={action.id} value={action.id} role={LIST_ITEM}>
          {action.name}
        </option>
      ))}
    </FormSelect>
  );
};
