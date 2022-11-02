import React from 'react';
import { Button } from 'react-bootstrap';

export const SpellButtonsComponent: React.FC<{
  cancel: () => void;
  finalize: () => void;
  finalizeDisabled: boolean;
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
      <Button
        className="me-3"
        size="lg"
        onClick={props.finalize}
        disabled={props.finalizeDisabled}
      >
        Finalize
      </Button>
    </>
  );
};
