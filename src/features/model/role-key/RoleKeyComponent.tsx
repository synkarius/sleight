import React, { useId } from 'react';
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  changeEditingRoleKeyValue,
  saveEditingRoleKey,
} from './role-key-reducers';

export const RoleKeyComponent: React.FC<{ roleKey: RoleKey }> = (props) => {
  const dispatch = useAppDispatch();
  const valueInputId = useId();

  const valueChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingRoleKeyValue(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingRoleKey());
  };

  return (
    <PanelComponent>
      <FormGroup as={Row} className="mb-3" controlId={valueInputId}>
        <FormLabel column sm="2">
          Role
        </FormLabel>
        <Col sm="6">
          <FormControl
            type="text"
            onChange={valueChangedHandler}
            value={props.roleKey.value}
          ></FormControl>
          <FormText className="text-muted">
            what concept this key identifies
          </FormText>
        </Col>
      </FormGroup>
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
