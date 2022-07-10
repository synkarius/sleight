import React from 'react';
import { Card } from 'react-bootstrap';

interface PanelComponentProps {
  header?: string;
  children: React.ReactNode;
}

export const PanelComponent: React.FC<PanelComponentProps> = (props) => {
  return (
    <Card className="m-2">
      {props.header && <Card.Header>{props.header}</Card.Header>}
      <div className="m-2">{props.children}</div>
    </Card>
  );
};
