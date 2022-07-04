import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { ChangeActionIdPayload, Command } from './command';

type Commands = {
    saved: ReduxFriendlyStringMap<Command>
    editing: Command | null
}

const initialState: Commands = {
    saved: {},
    editing: null
}

const commandsSlice = createSlice({
    name: "commands",
    initialState,
    reducers: {
        createNewEditingCommand: (state, action:PayloadAction<Command>) => {
            state.editing = action.payload;
        },
        selectCommand: (state, action:PayloadAction<string>) => {
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
        changeEditingCommandSpecRoleKeyId: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.specRoleKeyId = action.payload;
            }
        },
        addActionToEditingCommand: (state, action:PayloadAction<string>) => {
            if (state.editing) {
                state.editing.actionIds.push(action.payload);
            }
        },
        changeEditingCommandActionId: (state, action:PayloadAction<ChangeActionIdPayload>) => {
            if (state.editing) {
                state.editing.actionIds[action.payload.index] = action.payload.newActionId;
            }
        },
        deleteEditingCommandAction: (state, action:PayloadAction<number>) => {
            if (state.editing) {
                delete state.editing.actionIds[action.payload];
            }
        }
    }
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
    deleteEditingCommandAction,
} = commandsSlice.actions;
export const commandReducer = commandsSlice.reducer;