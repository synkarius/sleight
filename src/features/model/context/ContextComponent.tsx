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
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Context } from './context';
import {
  changeEditingContextMatcher,
  changeEditingContextName,
  changeEditingContextRoleKey,
  changeEditingContextType,
  clearEditingContext,
  saveEditingContext,
} from './context-reducers';
import { ContextType } from './context-types';

export const ContextComponent: React.FC<{ context: Context }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const roleKeyId = useId();
  const typeInputId = useId();
  const matcherInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingContextName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingContextType(event.target.value));
  };
  const matcherChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeEditingContextMatcher(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingContext());
    dispatch(clearEditingContext());
  };

  const matcherHelpText =
    props.context.type === ContextType.EXECUTABLE_NAME
      ? 'executable to match'
      : 'window title to match';

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
      <FormGroup as={Row} className="mb-3" controlId={roleKeyId}>
        <FormLabel column sm="2">
          Role Key
        </FormLabel>
        <Col sm="6">
          <RoleKeyDropdownComponent
            roleKeyId={props.context.roleKeyId}
            payloadFn={(id) => changeEditingContextRoleKey(id)}
          />
          <FormText className="text-muted">role of variable</FormText>
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
      <FormGroup as={Row} className="mb-3" controlId={matcherInputId}>
        <FormLabel column sm="2">
          Matcher
        </FormLabel>
        <Col sm="6">
          <FormControl
            type="text"
            onChange={matcherChangedHandler}
            value={props.context.matcher}
          ></FormControl>
          <FormText className="text-muted">{matcherHelpText}</FormText>
        </Col>
      </FormGroup>
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
