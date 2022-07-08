import React, { useId, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

export const ExpandCollapseComponent: React.FC<{
  buttonTextOpen: string;
  buttonTextClosed: string;
  children: React.ReactNode;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const collapseDivId = useId();
  return (
    <div>
      <Button
        className="mb-3"
        variant="outline-primary"
        size="lg"
        onClick={() => setOpen(!open)}
        aria-controls={collapseDivId}
        aria-expanded={open}
      >
        {open ? props.buttonTextOpen : props.buttonTextClosed}
      </Button>
      <Collapse in={open}>
        <div id={collapseDivId}>{props.children}</div>
      </Collapse>
    </div>
  );
};
