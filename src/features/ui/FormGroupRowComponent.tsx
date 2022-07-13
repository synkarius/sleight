import React, { useId } from 'react';
import { Form, FormGroup, FormLabel, FormText } from 'react-bootstrap';
import { RequiredAsteriskComponent } from './RequiredAsteriskComponent';

export const FormGroupRowComponent: React.FC<{
  children: React.ReactNode;
  labelText: string;
  descriptionText?: string;
  errorMessage?: string;
  required?: boolean;
}> = (props) => {
  const id = useId();
  return (
    <FormGroup className="mb-3" controlId={id}>
      <FormLabel>
        <span>{props.labelText}</span>
        <RequiredAsteriskComponent required={!!props.required} />
      </FormLabel>
      {props.children}
      {props.descriptionText && (
        <FormText className="text-muted">{props.descriptionText}</FormText>
      )}
      <Form.Control.Feedback type="invalid">
        {props.errorMessage}
      </Form.Control.Feedback>
    </FormGroup>
  );
};
