import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type ActionDropdownComponentProps = {
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
      aria-label="action selection"
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
    >
      <option value={SELECT_DEFAULT_VALUE}></option>
      {Object.values(actions).map((action) => (
        <option key={action.id} value={action.id}>
          {action.name}
        </option>
      ))}
    </FormSelect>
  );
};
