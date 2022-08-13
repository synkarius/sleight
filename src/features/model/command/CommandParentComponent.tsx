import React, { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { Command, createCommand } from './command';
import { CommandEditingContext } from './command-editing-context';
import { commandReactReducer } from './command-reducers';
import { CommandComponent } from './CommandComponent';

const init = (savedMap: Record<string, Command>): ((c?: string) => Command) => {
  return (commandId?: string) => {
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
  const injectionContext = useContext(InjectionContext);
  return (
    <ValidationComponent<Command>
      validators={[...injectionContext.validators.command]}
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
