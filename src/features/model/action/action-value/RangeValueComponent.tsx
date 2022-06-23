import React, { useId } from 'react';
import { Form } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { RangeValue } from './action-value';

export const RangeValueComponent: React.FC<{
  labelText: string;
  rangeValue: RangeValue;
}> = (props) => {
  const id = useId();
  // checkbox: toggles use-variable
  return (
    <FormGroupRowComponent labelText={props.labelText}>
      <Form.Check
        type="switch"
        id={id}
        label="Use Variable"
        checked={props.rangeValue.ided}
      />
    </FormGroupRowComponent>
  );
};
