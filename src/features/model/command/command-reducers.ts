import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { Command } from './command';
import {
  CommandReducerAction,
  CommandReducerActionIdAction,
  CommandReducerActionType,
  CommandReducerDeleteAction,
  CommandReducerMoveAction,
  CommandReducerSpecTypeAction,
  CommandReducerStringAction,
} from './command-editing-context';

export type CommandsState = {
  saved: ReduxFriendlyStringMap<Command>;
  editingId: string | undefined;
};

const initialState: CommandsState = {
  saved: {},
  editingId: undefined,
};

const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    selectCommand: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveEditingCommand: (state, action: PayloadAction<Command>) => {
      state.saved[action.payload.id] = action.payload;
    },
  },
});

export const { selectCommand, saveEditingCommand } = commandsSlice.actions;
export const commandReduxReducer = commandsSlice.reducer;

const changeEditingCommandName = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    name: action.payload,
  };
};
const changeEditingCommandRoleKey = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    roleKeyId: action.payload,
  };
};
const changeEditingCommandSpecType = (
  state: Command,
  action: CommandReducerSpecTypeAction
): Command => {
  return {
    ...state,
    specType: action.payload,
  };
};
const changeEditingCommandSpecVariableId = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    specVariableId: action.payload,
  };
};
const changeEditingCommandSpecRoleKeyId = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    specRoleKeyId: action.payload,
  };
};
const addActionToEditingCommand = (
  state: Command,
  action: CommandReducerStringAction
): Command => {
  return {
    ...state,
    actionIds: [...state.actionIds, action.payload],
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
  switch (action.type) {
    case CommandReducerActionType.CHANGE_NAME:
      return changeEditingCommandName(
        state,
        action as CommandReducerStringAction
      );
    case CommandReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingCommandRoleKey(
        state,
        action as CommandReducerStringAction
      );
    case CommandReducerActionType.CHANGE_SPEC_TYPE:
      return changeEditingCommandSpecType(
        state,
        action as CommandReducerSpecTypeAction
      );
    case CommandReducerActionType.CHANGE_SPEC_VARIABLE_ID:
      return changeEditingCommandSpecVariableId(
        state,
        action as CommandReducerStringAction
      );
    case CommandReducerActionType.CHANGE_SPEC_ROLE_KEY_ID:
      return changeEditingCommandSpecRoleKeyId(
        state,
        action as CommandReducerStringAction
      );
    case CommandReducerActionType.ADD_ACTION:
      return addActionToEditingCommand(
        state,
        action as CommandReducerStringAction
      );
    case CommandReducerActionType.CHANGE_ACTION:
      return changeEditingCommandActionId(
        state,
        action as CommandReducerActionIdAction
      );
    case CommandReducerActionType.MOVE_ACTION:
      return moveEditingCommandAction(
        state,
        action as CommandReducerMoveAction
      );
    case CommandReducerActionType.DELETE_ACTION:
      return deleteEditingCommandAction(
        state,
        action as CommandReducerDeleteAction
      );
    default:
      throw new ExhaustivenessFailureError(action.type);
  }
};
