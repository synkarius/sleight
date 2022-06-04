import React from 'react';
import { Form } from 'react-bootstrap';

export const PanelComponent: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  return <div className="border rounded m-2 p-2">{props.children}</div>;
};
