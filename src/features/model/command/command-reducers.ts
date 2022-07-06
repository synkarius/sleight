import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { MoveDirection } from '../common/move-direction';
import {
  ChangeActionIdPayload,
  Command,
  MoveCommandActionPayload,
} from './command';

export type CommandsState = {
  saved: ReduxFriendlyStringMap<Command>;
  editing: Command | null;
};

const initialState: CommandsState = {
  saved: {},
  editing: null,
};

const commandsSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    createNewEditingCommand: (state, action: PayloadAction<Command>) => {
      state.editing = action.payload;
    },
    selectCommand: (state, action: PayloadAction<string>) => {
      state.editing = state.saved[action.payload];
    },
    saveEditingCommand: (state) => {
      if (state.editing) {
        // TODO: validation
        state.saved[state.editing.id] = state.editing;
      }
    },
    clearEditingCommand: (state) => {
      state.editing = null;
    },
    changeEditingCommandName: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.name = action.payload;
      }
    },
    changeEditingCommandRoleKey: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.roleKeyId = action.payload;
      }
    },
    changeEditingCommandSpecType: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.commandSpecType = action.payload;
      }
    },
    changeEditingCommandSpecSpecId: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.specId = action.payload;
      }
    },
    changeEditingCommandSpecRoleKeyId: (
      state,
      action: PayloadAction<string>
    ) => {
      if (state.editing) {
        state.editing.specRoleKeyId = action.payload;
      }
    },
    addActionToEditingCommand: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.actionIds.push(action.payload);
      }
    },
    changeEditingCommandActionId: (
      state,
      action: PayloadAction<ChangeActionIdPayload>
    ) => {
      if (state.editing) {
        state.editing.actionIds[action.payload.index] =
          action.payload.newActionId;
      }
    },
    moveEditingCommandAction: (
      state,
      action: PayloadAction<MoveCommandActionPayload>
    ) => {
      if (state.editing) {
        const commandActionId = state.editing.actionIds[action.payload.index];
        if (commandActionId) {
          const newIndex =
            action.payload.direction === MoveDirection.UP
              ? action.payload.index - 1
              : action.payload.index + 1;
          if (newIndex >= 0 && newIndex < state.editing.actionIds.length) {
            const displaced = state.editing.actionIds[newIndex];
            state.editing.actionIds[newIndex] = commandActionId;
            state.editing.actionIds[action.payload.index] = displaced;
          }
        }
      }
    },
    deleteEditingCommandAction: (state, action: PayloadAction<number>) => {
      if (state.editing) {
        state.editing.actionIds.splice(action.payload, 1);
      }
    },
  },
});

export const {
  createNewEditingCommand,
  selectCommand,
  saveEditingCommand,
  clearEditingCommand,
  changeEditingCommandName,
  changeEditingCommandRoleKey,
  changeEditingCommandSpecType,
  changeEditingCommandSpecSpecId,
  changeEditingCommandSpecRoleKeyId,
  addActionToEditingCommand,
  changeEditingCommandActionId,
  moveEditingCommandAction,
  deleteEditingCommandAction,
} = commandsSlice.actions;
export const commandReducer = commandsSlice.reducer;
