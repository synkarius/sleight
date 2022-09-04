import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
import { WrongTypeError } from '../../../error/wrong-type-error';
import { SELECT_DEFAULT_VALUE } from '../../../common/consts';
import { MoveDirection } from '../../../common/move-direction';
import { Command } from './command';
import {
  CommandReducerAction,
  CommandReducerActionIdAction,
  CommandReducerActionType,
  CommandReducerDeleteAction,
  CommandReducerMoveAction,
  CommandReducerStringAction,
} from './command-editing-context';

export type CommandsState = {
  readonly saved: Record<string, Command>;
  readonly editingId?: string;
};

const initialState: CommandsState = {
  saved: {},
  editingId: undefined,
};

const injected = getDefaultInjectionContext();
const commandDefaultNamer = injected.default.namers.command;

const addDefaults = (command: Command): Command => {
  return {
    ...command,
    name: command.name.trim() || commandDefaultNamer.getDefaultName(command),
  };
};

const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    selectCommand: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveCommand: (state, action: PayloadAction<Command>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
    deleteCommand: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
  },
});

export const { selectCommand, saveCommand, deleteCommand } =
  commandsSlice.actions;
export const commandReduxReducer = commandsSlice.reducer;

const changeEditingCommandName = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    name: action.payload.trim() === '' ? '' : action.payload,
  };
};
const changeEditingCommandRoleKey = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    roleKey: action.payload,
  };
};
const changeEditingCommandContext = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    contextId: action.payload,
  };
};
const changeEditingCommandSpecId = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    specId: action.payload,
  };
};
const addActionToEditingCommand = (state: Command): Command => {
  return {
    ...state,
    actionIds: [...state.actionIds, SELECT_DEFAULT_VALUE],
  };
};
const changeEditingCommandActionId = (
  state: Command,
  action: CommandReducerActionIdAction
): Command => {
  const actionIdsCopy = [...state.actionIds];
  actionIdsCopy[action.payload.index] = action.payload.newActionId;
  return {
    ...state,
    actionIds: actionIdsCopy,
  };
};
const moveEditingCommandAction = (
  state: Command,
  action: CommandReducerMoveAction
): Command => {
  const commandActionId = state.actionIds[action.payload.index];
  if (commandActionId) {
    const newIndex =
      action.payload.direction === MoveDirection.UP
        ? action.payload.index - 1
        : action.payload.index + 1;
    if (newIndex >= 0 && newIndex < state.actionIds.length) {
      const displaced = state.actionIds[newIndex];
      const actionIdsCopy = [...state.actionIds];
      actionIdsCopy[newIndex] = commandActionId;
      actionIdsCopy[action.payload.index] = displaced;
      return {
        ...state,
        actionIds: actionIdsCopy,
      };
    }
  }
  return { ...state };
};
const deleteEditingCommandAction = (
  state: Command,
  action: CommandReducerDeleteAction
): Command => {
  const actionIdsCopy = [...state.actionIds];
  actionIdsCopy.splice(action.payload, 1);
  return {
    ...state,
    actionIds: actionIdsCopy,
  };
};

export const commandReactReducer = (
  state: Command,
  action: CommandReducerAction
): Command => {
  const actionType = action.type;
  switch (actionType) {
    case CommandReducerActionType.CHANGE_NAME:
      return changeEditingCommandName(state, action);
    case CommandReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingCommandRoleKey(state, action);
    case CommandReducerActionType.CHANGE_CONTEXT:
      return changeEditingCommandContext(state, action);
    case CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID:
      return changeEditingCommandSpecId(state, action);
    case CommandReducerActionType.ADD_ACTION:
      return addActionToEditingCommand(state);
    case CommandReducerActionType.CHANGE_ACTION:
      return changeEditingCommandActionId(state, action);
    case CommandReducerActionType.MOVE_ACTION:
      return moveEditingCommandAction(state, action);
    case CommandReducerActionType.DELETE_ACTION:
      return deleteEditingCommandAction(state, action);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
