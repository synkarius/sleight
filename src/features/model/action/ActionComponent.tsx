import React, { useId } from 'react';
import {
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
import { Action } from './action';
import { ActionType } from './action-types';
import {
  changeEditingActionName,
  changeEditingActionRoleKey,
  changeEditingActionType,
} from './action-reducers';
import { SendKeyComponent } from './send-key/SendKeyComponent';
import { SendKeyAction } from './send-key/send-key';

export const ActionComponent: React.FC<{ action: Action }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const roleKeyInputId = useId();
  const typeInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingActionName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingActionType({ actionType: event.target.value }));
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
            value={props.action.name}
          ></FormControl>
          <FormText className="text-muted">name of action</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={roleKeyInputId}>
        <FormLabel column sm="2">
          Role Key
        </FormLabel>
        <Col sm="6">
          <RoleKeyDropdownComponent
            roleKeyId={props.action.roleKeyId}
            payloadFn={(id) => changeEditingActionRoleKey(id)}
          />
          <FormText className="text-muted">role of action</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={typeInputId}>
        <FormLabel column sm="2">
          Type
        </FormLabel>
        <Col sm="6">
          <Form.Select
            aria-label="action type selection"
            onChange={typeChangedHandler}
            value={props.action.type}
          >
            {ActionType.values().map((ait) => (
              <option key={ait} value={ait}>
                {ait}
              </option>
            ))}
          </Form.Select>
          <FormText className="text-muted">kind of action</FormText>
        </Col>
      </FormGroup>
      {props.action.type === ActionType.SEND_KEY && (
        <SendKeyComponent sendKeyAction={props.action as SendKeyAction} />
      )}
    </PanelComponent>
  );
};
