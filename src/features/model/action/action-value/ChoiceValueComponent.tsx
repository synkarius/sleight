import React, { useId } from 'react';
import { Form } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { ChoiceValue } from './action-value';

export const ChoiceValueComponent: React.FC<{
  labelText: string;
  choiceValue: ChoiceValue;
}> = (props) => {
  const id = useId();
  // checkbox: toggles use-variable
  return (
    <FormGroupRowComponent labelText={props.labelText}>
      <Form.Check
        type="switch"
        id={id}
        label="Use Variable"
        checked={props.choiceValue.ided}
      />
    </FormGroupRowComponent>
  );
};
