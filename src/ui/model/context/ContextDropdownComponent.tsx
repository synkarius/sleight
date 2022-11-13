import React from 'react';
import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { UNSELECTED_ID } from '../../../core/common/consts';
import { fieldName } from '../../../validation/field-name';

type ContextDropdownComponentProps = {
  readonly contextId?: string;
  readonly field: Field;
  readonly onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  readonly onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  readonly isInvalid?: boolean;
};

export const ContextDropdownComponent: React.FC<
  ContextDropdownComponentProps
> = (props) => {
  const contextsSaved = useAppSelector((state) => state.context.saved);

  return (
    <FormSelect
      value={props.contextId ?? UNSELECTED_ID}
      aria-label={fieldName(props.field)}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role="list"
    >
      <option value={UNSELECTED_ID} role="listitem"></option>
      {Object.values(contextsSaved).map((context) => (
        <option key={context.id} value={context.id} role="listitem">
          {context.name}
        </option>
      ))}
    </FormSelect>
  );
};
