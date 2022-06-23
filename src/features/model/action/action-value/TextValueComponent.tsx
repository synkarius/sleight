import React, { useId } from 'react';
import { Form } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { TextValue } from './action-value';

export const TextValueComponent: React.FC<{
  labelText: string;
  textValue: TextValue;
}> = (props) => {
  const id = useId();
  // checkbox: toggles use-variable
  return (
    <FormGroupRowComponent labelText={props.labelText}>
      <Form.Check
        type="switch"
        id={id}
        label="Use Variable"
        checked={props.textValue.ided}
      />
    </FormGroupRowComponent>
  );
};
