import React from 'react';
import { Card } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';

interface PanelComponentProps {
  header?: string;
  children: React.ReactNode;
}

export const PanelComponent: React.FC<PanelComponentProps> = (props) => {
  return (
    <Card className="m-2">
      {props.header && <CardHeader>{props.header}</CardHeader>}
      <div className="m-2">{props.children}</div>
    </Card>
  );
};
