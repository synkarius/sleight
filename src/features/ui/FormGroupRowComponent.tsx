import React, { useId } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';

export const FormGroupRowComponent: React.FC<{
  children: React.ReactNode;
  labelText: string;
}> = (props) => {
  const id = useId();
  return (
    <FormGroup className="mb-3" controlId={id}>
      <FormLabel>{props.labelText}</FormLabel>
      {props.children}
    </FormGroup>
  );
};
