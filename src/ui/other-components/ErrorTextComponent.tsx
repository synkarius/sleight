import React from 'react';
import { Col } from 'react-bootstrap';

export const ErrorTextComponent: React.FC<{
  errorMessage?: string;
  row?: boolean;
}> = (props) => {
  if (props.row && props.errorMessage) {
    return (
      <Col sm="12" className="mb-3">
        <span className="small text-danger">{props.errorMessage}</span>
      </Col>
    );
  } else if (props.errorMessage) {
    return <span className="small text-danger">{props.errorMessage}</span>;
  } else {
    return <></>;
  }
};
