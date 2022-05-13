import React from 'react';
import { Form } from 'react-bootstrap';

export const PanelComponent: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  return <Form className="border rounded m-2 p-2">{props.children}</Form>;
};
