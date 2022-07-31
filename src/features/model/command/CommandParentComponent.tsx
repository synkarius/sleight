import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Command, createCommand } from './command';
import { CommandEditingContext } from './command-editing-context';
import { commandReactReducer } from './command-reducers';
import {
  commandSpecRoleKeySelectedValidator,
  commandSpecVariableSelectedValidator,
} from './command-validators';
import { CommandComponent } from './CommandComponent';

const init = (
  savedMap: ReduxFriendlyStringMap<Command>
): ((c: string | undefined) => Command) => {
  return (commandId: string | undefined) => {
    if (commandId && savedMap[commandId]) {
      return { ...savedMap[commandId] };
    }
    return createCommand();
  };
};

export const CommandParentComponent: React.FC<{ commandId?: string }> = (
  props
) => {
  const savedMap = useAppSelector((state) => state.command.saved);
  const [editing, localDispatch] = useReducer(
    commandReactReducer,
    props.commandId,
    init(savedMap)
  );
  return (
    <ValidationComponent<Command>
      validators={[
        commandSpecVariableSelectedValidator,
        commandSpecRoleKeySelectedValidator,
      ]}
      editing={editing}
    >
      <CommandEditingContext.Provider
        value={{ localDispatchFn: localDispatch }}
      >
        <CommandComponent command={editing} />
      </CommandEditingContext.Provider>
    </ValidationComponent>
  );
};