import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { Action, ChangeActionTypePayload, ChangeSendKeyModePayload } from './action';

type Actions = {
    saved: ReduxFriendlyStringMap<Action>
    editing: Action | null
}

const initialState: Actions = {
    saved: {},
    editing: null
}

const actionsSlice = createSlice({
    name: "actions",
    initialState,
    reducers: {
        createNewEditingAction: (state, action:PayloadAction<Action>) => {
            state.editing = action.payload;
        },
        selectAction: (state, action:PayloadAction<string>) => {
            state.editing = state.saved[action.payload];
        },
        saveEditingAction: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved[state.editing.id] = state.editing;
            }
        },
        clearEditingAction: (state) => {
            state.editing = null;
        },
        changeEditingActionName: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.name = action.payload;
            }
        },
        changeEditingActionRoleKey: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.roleKeyId = action.payload;
            }
        },
        changeEditingActionType: (state, action: PayloadAction<ChangeActionTypePayload>) => {
            // casting here to non-null b/c should not ever be null while editing
            const editing = state.editing as Action;
            // TODO

            // switch (action.payload.variableType) {
            //     case VariableType.TEXT:
            //         state.editing = copyIntoText(variable);
            //         break;
            //     case VariableType.RANGE:
            //         state.editing = copyIntoRange(variable);
            //         break;
            //     case VariableType.CHOICE:
            //         const selectorId = action.payload.selectorId as string;
            //         state.editing = copyIntoChoice(variable, selectorId);
            //         break;
            //     default:
            //         throw new Error("invalid action type: " + action.payload);
            // }
        },
        changeEditingSendKeyMode: (state, action:PayloadAction<ChangeSendKeyModePayload>) => {
            // TODO
        }
    }
});

export const { 
    createNewEditingAction,
    selectAction,
    clearEditingAction,
    changeEditingActionName, 
    changeEditingActionRoleKey,
    changeEditingActionType, 
    saveEditingAction,
    changeEditingSendKeyMode
} = actionsSlice.actions;
export const actionReducer = actionsSlice.reducer;