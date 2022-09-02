import React from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * Allows an external component to control the visibility
 * of this component.
 */
export type DeleteModalConfig = {
  readonly show: boolean;
  readonly setShow: (show: boolean) => void;
};

export const DeleteModal: React.FC<{
  deleting: string;
  config: DeleteModalConfig;
  deleteFn: () => void;
}> = (props) => {
  const handleDelete = () => {
    props.deleteFn();
    props.config.setShow(false);
  };
  const handleCancel = () => props.config.setShow(false);

  return (
    <Modal show={props.config.show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Really delete {props.deleting}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
