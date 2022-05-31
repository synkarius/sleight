import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { upsertIded } from '../../domain';
import { 
    Choice, 
    ChoiceItem, 
    createChoiceItem, 
    RemoveChoiceItemPayload, 
    EditChoiceItemValuePayload, 
    copyIntoChoice,
    ChangeVariableTypePayload
} from "./choice/choice";
import { Extra } from "./extra";
import { VariableType } from './extra-types';
import { Range, copyIntoRange } from './range/range';
import { copyIntoText } from './text/text';

type Extras = {
    saved: Extra[]
    editing: Extra | null
}

const initialState: Extras = {
    saved: [],
    editing: null
}

const extrasSlice = createSlice({
    name: "extras",
    initialState,
    reducers: {
        createNewEditingExtra: (state, action:PayloadAction<Extra>) => {
            state.editing = action.payload;
        },
        selectExtra: (state, action:PayloadAction<string>) => {
            state.editing = state.saved.find(extra => extra.id === action.payload) as Extra;
        },
        saveEditingExtra: (state) => {
            if (state.editing) {
                // TODO: validation
                state.saved = upsertIded(state.saved, state.editing);
            }
        },

        clearEditingExtra: (state) => {
            state.editing = null;
        },
        changeEditingExtraName: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                state.editing.name = action.payload;
            }
        },
        changeEditingExtraType: (state, action: PayloadAction<ChangeVariableTypePayload>) => {
            // casting here to non-null b/c should not ever be null while editing
            const variable = state.editing as Extra;
            switch (action.payload.variableType) {
                case VariableType.TEXT:
                    state.editing = copyIntoText(variable);
                    break;
                case VariableType.RANGE:
                    state.editing = copyIntoRange(variable);
                    break;
                case VariableType.CHOICE:
                    const selectorId = action.payload.selectorId as string;
                    state.editing = copyIntoChoice(variable, selectorId);
                    break;
                default:
                    throw new Error("invalid extra type: " + action.payload);
            }
        },
        editRangeMin: (state, action: PayloadAction<number>) => {
            const range = state.editing as Range;
            range.beginInclusive = action.payload;
        },
        editRangeMax: (state, action: PayloadAction<number>) => {
            const range = state.editing as Range;
            range.endInclusive = action.payload;
        },
        addChoiceItem: (state, action: PayloadAction<string>) => {
            if (state.editing) {
                const selectorId = action.payload;
                (state.editing as Choice).items.push(createChoiceItem(selectorId));
            }
        },
        editChoiceItemValue: (state, action:PayloadAction<EditChoiceItemValuePayload>) => {
            // TODO: validation
            if (state.editing) {
                const choice = state.editing as Choice;
                const choiceItem = choice.items.find(i => i.id === action.payload.choiceItemId) as ChoiceItem;
                choiceItem.value = action.payload.value;
            }
        },
        removeChoiceItem: (state, action:PayloadAction<RemoveChoiceItemPayload>) => {
            if (state.editing) {
                const choice = state.editing as Choice;
                choice.items = choice.items.filter(item => item.id !== action.payload.choiceItemId);
            }
        }
    }
});

export const { 
    createNewEditingExtra,
    selectExtra,
    clearEditingExtra,
    changeEditingExtraName, 
    changeEditingExtraType, 
    saveEditingExtra, 
    editRangeMin, 
    editRangeMax, 
    addChoiceItem, 
    editChoiceItemValue,
    removeChoiceItem
} = extrasSlice.actions;
export const extraReducer = extrasSlice.reducer;