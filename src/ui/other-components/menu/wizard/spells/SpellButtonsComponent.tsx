import React from 'react';
import { Button } from 'react-bootstrap';

export const SpellButtonsComponent: React.FC<{
  cancel: () => void;
  back?: () => void;
  next: () => void;
}> = (props) => {
  return (
    <>
      <Button
        variant="warning"
        className="me-3"
        size="lg"
        onClick={props.cancel}
      >
        Cancel
      </Button>
      {props.back && (
        <Button
          variant="outline-primary"
          className="me-3"
          size="lg"
          onClick={props.back}
        >
          Back
        </Button>
      )}
      <Button className="me-3" size="lg" onClick={props.next}>
        Next
      </Button>
    </>
  );
};
