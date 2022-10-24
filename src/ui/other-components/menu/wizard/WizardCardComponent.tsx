import React, { ReactElement } from 'react';
import { Button, Card } from 'react-bootstrap';

export const WizardCardComponent: React.FC<{
  icon: ReactElement;
  description: string;
  onClick: () => void;
}> = (props) => {
  return (
    <div className="mx-3 mt-4" style={{ display: 'inline-block' }}>
      <Card>
        <Card.Header>{props.icon}</Card.Header>
        <Card.Body>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary" onClick={props.onClick}>
            Make This Command
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};
