import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { LIST_ITEM } from '../../../core/common/accessibility-roles';
import { UNSELECTED_ID } from '../../../core/common/consts';
import { fieldName } from '../../../validation/field-name';

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
      value={props.actionId ?? UNSELECTED_ID}
      aria-label={fieldName(props.field)}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={UNSELECTED_ID} role={LIST_ITEM}></option>
      {Object.values(actions).map((action) => (
        <option key={action.id} value={action.id} role={LIST_ITEM}>
          {action.name}
        </option>
      ))}
    </FormSelect>
  );
};
