import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type ActionDropdownComponentProps = {
  actionId: string | null;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
};

export const ActionDropdownComponent: React.FC<ActionDropdownComponentProps> = (
  props
) => {
  const actions = useAppSelector((state) => state.action.saved);

  return (
    <FormSelect
      aria-label="action selection"
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.actionId || SELECT_DEFAULT_VALUE}
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
