import React, { useId } from 'react';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';

export const FormGroupRowComponent: React.FC<{
  children: React.ReactNode;
  labelText: string;
}> = (props) => {
  const id = useId();
  return (
    <FormGroup as={Row} className="mb-3" controlId={id}>
      <FormLabel column sm="2">
        {props.labelText}
      </FormLabel>
      <Col sm="6">{props.children}</Col>
    </FormGroup>
  );
};
