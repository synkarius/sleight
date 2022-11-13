import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { LIST_ITEM } from '../../../core/common/accessibility-roles';
import { UNSELECTED_ID } from '../../../core/common/consts';
import { fieldName } from '../../../validation/field-name';

type FnDropdownComponentProps = {
  readonly field: Field;
  readonly fnId?: string;
  readonly onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  readonly onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  readonly isInvalid?: boolean;
};

export const FnDropdownComponent: React.FC<FnDropdownComponentProps> = (
  props
) => {
  const fns = useAppSelector((state) => state.fn.saved);

  return (
    <FormSelect
      value={props.fnId ?? UNSELECTED_ID}
      aria-label={fieldName(props.field)}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={UNSELECTED_ID} role={LIST_ITEM}></option>
      {Object.values(fns).map((fn) => (
        <option key={fn.id} value={fn.id} role={LIST_ITEM}>
          {fn.name}
        </option>
      ))}
    </FormSelect>
  );
};
