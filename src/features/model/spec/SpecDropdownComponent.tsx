import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type SpecDropdownComponentProps = {
  specId: string | null;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
};

export const SpecDropdownComponent: React.FC<SpecDropdownComponentProps> = (
  props
) => {
  const specsSaved = useAppSelector((state) => state.spec.saved);

  // const selectedChangedHandler = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   dispatch(props.payloadFn(event.target.value));
  // };
  return (
    <FormSelect
      aria-label="spec selection"
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.specId || SELECT_DEFAULT_VALUE}
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
