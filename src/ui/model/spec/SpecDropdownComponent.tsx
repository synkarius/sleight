import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { UNSELECTED_ID } from '../../../core/common/consts';
import { fieldName } from '../../../validation/field-name';

type SpecDropdownComponentProps = {
  readonly specId?: string;
  readonly field: Field;
  readonly onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  readonly onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  readonly isInvalid?: boolean;
};

export const SpecDropdownComponent: React.FC<SpecDropdownComponentProps> = (
  props
) => {
  const specsSaved = useAppSelector((state) => state.spec.saved);

  return (
    <FormSelect
      value={props.specId ?? UNSELECTED_ID}
      aria-label={fieldName(props.field)}
      role="list"
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
    >
      <option value={UNSELECTED_ID} role="listitem"></option>
      {Object.values(specsSaved).map((spec) => (
        <option key={spec.id} value={spec.id} role="listitem">
          {spec.name}
        </option>
      ))}
    </FormSelect>
  );
};
