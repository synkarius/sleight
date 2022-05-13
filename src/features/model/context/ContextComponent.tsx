import React, { useId } from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { Context } from './context';
import {
  editFocusedContextName,
  editFocusedContextType,
  upsertFocusedContext,
} from './context-reducers';
import { ContextType } from './context-types';

export const ContextComponent: React.FC<{ context: Context }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const typeInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editFocusedContextName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(editFocusedContextType(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(upsertFocusedContext());
  };

  return (
    <PanelComponent>
      <FormGroup as={Row} className="mb-3" controlId={nameInputId}>
        <FormLabel column sm="2">
          Name
        </FormLabel>
        <Col sm="6">
          <FormControl
            type="text"
            onChange={nameChangedHandler}
            value={props.context.name}
          ></FormControl>
          <FormText className="text-muted">name of context</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={typeInputId}>
        <FormLabel column sm="2">
          Type
        </FormLabel>
        <Col sm="6">
          <Form.Select
            aria-label="Variable type selection"
            onChange={typeChangedHandler}
            value={props.context.type}
          >
            {ContextType.values().map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </Form.Select>
          <FormText className="text-muted">kind of variable</FormText>
        </Col>
      </FormGroup>
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
