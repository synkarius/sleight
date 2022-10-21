import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Command, createCommand } from '../../../data/model/command/command';
import { CommandEditingContext } from './command-editing-context';
import {
  commandReactReducer,
  deleteCommand,
} from '../../../core/reducers/command-reducers';
import { CommandComponent } from './CommandComponent';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { doNothing } from '../../../core/common/common-functions';

const init = (savedMap: Record<string, Command>): ((c?: string) => Command) => {
  return (commandId?: string) => {
    if (commandId && savedMap[commandId]) {
      return { ...savedMap[commandId] };
    }
    return createCommand();
  };
};

export const CommandParentComponent: React.FC<{
  commandId?: string;
  closeFn?: () => void;
}> = (props) => {
  const savedMap = useAppSelector((state) => state.command.saved);
  const [editing, localDispatch] = useReducer(
    commandReactReducer,
    props.commandId,
    init(savedMap)
  );
  const reduxDispatch = useAppDispatch();
  const container = useContext(InjectionContext);
  const [show, setShow] = useState(false);

  const closeFn = props.closeFn ?? doNothing;
  const handleDelete = () => {
    reduxDispatch(deleteCommand(editing.id));
    closeFn();
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Command);

  return (
    <ValidationComponent<Command> validators={validators} editing={editing}>
      <CommandEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <CommandComponent command={editing} closeFn={closeFn} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.CMD_DELETE_MODAL_DELETE}
          cancelField={Field.CMD_DELETE_MODAL_CANCEL}
        />
      </CommandEditingContext.Provider>
    </ValidationComponent>
  );
};
