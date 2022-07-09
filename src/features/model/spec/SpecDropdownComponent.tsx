import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type SpecDropdownComponentProps = {
  specId: string | null;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
};

export const SpecDropdownComponent: React.FC<SpecDropdownComponentProps> = (
  props
) => {
  const specsSaved = useAppSelector((state) => state.spec.saved);

  return (
    <FormSelect
      value={props.specId || SELECT_DEFAULT_VALUE}
      aria-label="spec selection"
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
    >
      <option value={SELECT_DEFAULT_VALUE}></option>
      {Object.values(specsSaved).map((spec) => (
        <option key={spec.id} value={spec.id}>
          {spec.name}
        </option>
      ))}
    </FormSelect>
  );
};
