import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendlyStringMap } from '../../../util/structures';
import { MoveDirection } from '../common/move-direction';
import { AddSpecItemPayload, ChangeSpecItemOrderPayload, ChangeSpecItemTypePayload, ChangeSpecItemVariableId, Spec, SpecItem, SpecItemType } from './spec';

type Specs = {
    saved: ReduxFriendlyStringMap<Spec>
    editing: Spec | null
}

const initialState: Specs = {
    saved: {},
    editing: null
}

const specItemIdMatches:((specItemId:string) => ((specItem:SpecItem)=> boolean)) = (specItemId) => (specItem => specItem.id === specItemId);

const specsSlice = createSlice({
    name: "specs",
    initialState,
    reducers: {
        createNewEditingSpec: (state, action:PayloadAction<Spec>) => {
            state.editing = action.payload;
        },
        selectSpec: (state, action:PayloadAction<string>) => {
            const specId = action.payload;
            state.editing = state.saved[specId];
        },
        saveEditingSpec: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved[state.editing.id] = state.editing;
            }
        },
        clearEditingSpec: (state) => {
            state.editing = null;
        },
        changeEditingSpecName: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.name = action.payload;
            }
        },
        changeEditingSpecRoleKey: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.roleKeyId = action.payload;
            }
        },
        addSpecItem: (state, action:PayloadAction<SpecItem>) => {
            if (state.editing) {
                state.editing.items.push(action.payload);
            }
        },
        changeSpecItemType: (state, action:PayloadAction<ChangeSpecItemTypePayload>) => {
            if (state.editing) {
                const specItem = state.editing.items.find(specItem => specItem.id === action.payload.specItemId);
                if (specItem) {
                    specItem.itemId = action.payload.specItemItemId;
                    specItem.itemType = action.payload.specItemItemType;
                }
            }
        },
        changeSpecItemVariableId: (state, action:PayloadAction<ChangeSpecItemVariableId>) => {
            if (state.editing){ 
                const specItem = state.editing.items.find(specItem => specItem.id === action.payload.specItemId && specItem.itemType === SpecItemType.VARIABLE);
                if (specItem) {
                    specItem.itemId = action.payload.variableId;
                }
            }
        },
        changeSpecItemOrder: (state, action:PayloadAction<ChangeSpecItemOrderPayload>) => {
            if (state.editing) {
                const specItem = state.editing.items.find(specItemIdMatches(action.payload.specItemId));
                const specItemIndex = state.editing.items.findIndex(specItemIdMatches(action.payload.specItemId));
                if (specItem && specItemIndex) {
                    const newIndex = action.payload.moveDirection === MoveDirection.UP ? specItemIndex - 1 : specItemIndex + 1;
                    if (newIndex >= 0 && newIndex < state.editing.items.length) {
                        const displaced = state.editing.items[newIndex];
                        state.editing.items[newIndex] = specItem;
                        state.editing.items[specItemIndex] = displaced;
                    }
                }
            }
        },
        deleteSpecItem: (state, action: PayloadAction<string>) => {
            if (state.editing && state.editing.items.length > 1) {
                state.editing.items = state.editing.items.filter(specItem => specItem.id !== action.payload);
            }
        }
    }
});

export const { 
    createNewEditingSpec,
    selectSpec,
    saveEditingSpec,
    clearEditingSpec,
    changeEditingSpecName,
    changeEditingSpecRoleKey,
    addSpecItem,
    changeSpecItemType,
    changeSpecItemVariableId,
    changeSpecItemOrder,
    deleteSpecItem
} = specsSlice.actions;
export const specReducer = specsSlice.reducer;