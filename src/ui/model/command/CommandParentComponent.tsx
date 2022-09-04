import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';
import { DeleteModal } from '../../other-components/DeleteModal';
import { Command, createCommand } from './command';
import { CommandEditingContext } from './command-editing-context';
import { commandReactReducer, deleteCommand } from './command-reducers';
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
  const reduxDispatch = useAppDispatch();
  const injectionContext = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteCommand(editing.id));
    reduxDispatch(setEditorFocus());
  };
  const deleteModalConfig = { show, setShow };

  return (
    <ValidationComponent<Command>
      validators={[...injectionContext.validators.command]}
      editing={editing}
    >
      <CommandEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <CommandComponent command={editing} />
        <DeleteModal
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
        />
      </CommandEditingContext.Provider>
    </ValidationComponent>
  );
};
