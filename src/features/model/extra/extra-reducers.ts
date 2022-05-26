import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { upsertIded } from '../../domain';
import { createSelector, createSelectorItem } from '../selector/selector';
import { 
    Choice, 
    ChoiceItem, 
    createChoice, 
    createChoiceItem, 
    RemoveChoiceItemPayload, 
    EditChoiceItemSelectorPayload, 
    EditChoiceItemValuePayload 
} from "./choice/choice";
import { Extra } from "./extra";
import { VariableType } from './extra-types';
import { Range, createRange } from './range/range';
import { createText, Text } from './text/text';

type Extras = {
    extras: Extra[]
    focused: Extra | null
}

const initialState: Extras = {
    extras: [],
    focused: null
}

const extrasSlice = createSlice({
    name: "extras",
    initialState,
    reducers: {
        createNewExtra: (state) => {
            const selector = createSelector([createSelectorItem()]);
            state.focused = createText(selector);
        },
        selectExtra: (state, action:PayloadAction<string>) => {
            state.focused = state.extras.find(extra => extra.id === action.payload) as Extra;
        },
        clearFocusedExtra: (state) => {
            state.focused = null;
        },
        editFocusedExtraName: (state, action: PayloadAction<string>) => {
            // casting here to non-null b/c should not ever be null while editing
            const focused = state.focused as Extra; 
            focused.name = action.payload;
        },
        editFocusedExtraType: (state, action: PayloadAction<string>) => {
            // casting here to non-null b/c should not ever be null while editing
            switch (action.payload) {
                case VariableType.TEXT:
                    const text = state.focused as Text;
                    state.focused = createText(text.selector, text);
                    break;
                case VariableType.RANGE:
                    state.focused = createRange(0, 9, state.focused);
                    break;
                case VariableType.CHOICE:
                    state.focused = createChoice([createChoiceItem()], state.focused)
                    break;
                default:
                    throw new Error("invalid extra type: " + action.payload);
            }
        },
        upsertFocusedExtra: (state) => {
            // casting here to non-null b/c should not ever be null while editing
            // TODO: validation
            state.extras = upsertIded(state.extras, state.focused as Extra);
        },
        editRangeMin: (state, action: PayloadAction<number>) => {
            const range = state.focused as Range;
            range.beginInclusive = action.payload;
        },
        editRangeMax: (state, action: PayloadAction<number>) => {
            const range = state.focused as Range;
            range.endInclusive = action.payload;
        },
        addChoiceItem: (state) => {
            if (state.focused) {
                (state.focused as Choice).items.push(createChoiceItem());
            }
        },
        editChoiceItemSelector: (state, action:PayloadAction<EditChoiceItemSelectorPayload>) => {
            // TODO: validation
            if (state.focused) {
                const choice = state.focused as Choice;
                const choiceItem = choice.items.find(i => i.id === action.payload.choiceItemId) as ChoiceItem;
                choiceItem.selector = action.payload.selector;    
            }
        },
        editChoiceItemValue: (state, action:PayloadAction<EditChoiceItemValuePayload>) => {
            // TODO: validation
            if (state.focused) {
                const choice = state.focused as Choice;
                const choiceItem = choice.items.find(i => i.id === action.payload.choiceItemId) as ChoiceItem;
                choiceItem.value = action.payload.value;
            }
        },
        removeChoiceItem: (state, action:PayloadAction<RemoveChoiceItemPayload>) => {
            if (state.focused) {
                const choice = state.focused as Choice;
                choice.items = choice.items.filter(item => item.id !== action.payload.choiceItemId);
            }
        }
    }
});

export const { 
    createNewExtra,
    selectExtra,
    clearFocusedExtra,
    editFocusedExtraName, 
    editFocusedExtraType, 
    upsertFocusedExtra, 
    editRangeMin, 
    editRangeMax, 
    addChoiceItem, 
    editChoiceItemSelector,
    editChoiceItemValue,
    removeChoiceItem
} = extrasSlice.actions;
export const extraReducer = extrasSlice.reducer;