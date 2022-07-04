import React from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
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
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.context.name}
        />
        <FormText className="text-muted">name of context</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.context.roleKeyId}
          payloadFn={(id) => changeEditingContextRoleKey(id)}
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label="Variable type selection"
          onChange={typeChangedHandler}
          value={props.context.type}
        >
          {ContextType.values().map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Matcher">
        <FormControl
          type="text"
          onChange={matcherChangedHandler}
          value={props.context.matcher}
        />
        <FormText className="text-muted">{matcherHelpText}</FormText>
      </FormGroupRowComponent>
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
