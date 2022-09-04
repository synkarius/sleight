import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';

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
      value={props.specId || SELECT_DEFAULT_VALUE}
      aria-label={Field[props.field]}
      role="list"
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
    >
      <option value={SELECT_DEFAULT_VALUE} role="listitem"></option>
      {Object.values(specsSaved).map((spec) => (
        <option key={spec.id} value={spec.id} role="listitem">
          {spec.name}
        </option>
      ))}
    </FormSelect>
  );
};
