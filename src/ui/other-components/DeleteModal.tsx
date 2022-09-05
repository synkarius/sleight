import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { identity } from '../../common/common-functions';
import { ValidationContext } from '../../validation/validation-context';
import { Field } from '../../validation/validation-field';
import { ErrorTextComponent } from './ErrorTextComponent';

/**
 * Allows an external component to control the visibility
 * of this component.
 */
export type DeleteModalConfig = {
  readonly show: boolean;
  readonly setShow: (show: boolean) => void;
};

export const DeleteModal: React.FC<{
  deletingName: string;
  config: DeleteModalConfig;
  deleteFn: () => void;
  deleteField: Field;
  cancelField: Field;
}> = (props) => {
  const validationContext = useContext(ValidationContext);

  const handleDelete = () => {
    props.deleteFn();
    props.config.setShow(false);
  };
  const handleCancel = () => props.config.setShow(false);

  const errorMessage = validationContext
    .validateForDelete()
    .map((result) => result.message)
    .find(identity);

  return (
    <Modal show={props.config.show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!errorMessage ? (
          <span>
            Really delete{' '}
            <strong className="text-info">{props.deletingName}</strong>?
          </span>
        ) : (
          <ErrorTextComponent errorMessage={errorMessage} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCancel}
          aria-label={Field[props.cancelField]}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={!!errorMessage}
          aria-label={Field[props.deleteField]}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
