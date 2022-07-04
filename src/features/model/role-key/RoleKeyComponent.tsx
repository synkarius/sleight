import React from 'react';
import { Button, FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKey } from './role-key';
import {
  changeEditingRoleKeyValue,
  saveEditingRoleKey,
} from './role-key-reducers';

export const RoleKeyComponent: React.FC<{ roleKey: RoleKey }> = (props) => {
  const dispatch = useAppDispatch();

  const valueChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingRoleKeyValue(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingRoleKey());
  };

  return (
    <PanelComponent>
      <FormGroupRowComponent labelText="Role">
        <FormControl
          type="text"
          onChange={valueChangedHandler}
          value={props.roleKey.value}
        />
        <FormText className="text-muted">
          what concept this key identifies
        </FormText>
      </FormGroupRowComponent>
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
