import React from 'react';
import { FormControl, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { PanelComponent } from '../../ui/PanelComponent';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { Command } from './command';
import {
  changeEditingCommandName,
  changeEditingCommandRoleKey,
} from './command-reducers';

export const CommandComponent: React.FC<{ command: Command }> = (props) => {
  const dispatch = useAppDispatch();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingCommandName(event.target.value));
  };

  return (
    <PanelComponent>
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.command.name}
        />
        <FormText className="text-muted">name of command</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.command.roleKeyId}
          payloadFn={(id) => changeEditingCommandRoleKey(id)}
        />
        <FormText className="text-muted">role of command</FormText>
      </FormGroupRowComponent>
    </PanelComponent>
  );
};
