import React, { CSSProperties } from 'react';
import { Card } from 'react-bootstrap';

interface PanelComponentProps {
  header?: string;
  children: React.ReactNode;
  scrollable?: boolean;
}

export const PanelComponent: React.FC<PanelComponentProps> = (props) => {
  const style: CSSProperties | undefined = props.scrollable
    ? { overflowY: 'auto', overflowX: 'hidden' }
    : undefined;
  return (
    <Card className="m-2" style={style}>
      {props.header && <Card.Header>{props.header}</Card.Header>}
      <div className="m-2">{props.children}</div>
    </Card>
  );
};
