import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/structures';
import {
  Choice,
  ChoiceItem,
  createChoiceItem,
  RemoveChoiceItemPayload,
  EditChoiceItemValuePayload,
  copyIntoChoice,
  ChangeVariableTypePayload,
} from './choice/choice';
import { Variable } from './variable';
import { VariableType } from './variable-types';
import { Range, copyIntoRange } from './range/range';
import { copyIntoText } from './text/text';
import { UnhandledVariableTypeError } from '../../../error/UnhandledVariableTypeError';

export type VariablesState = {
  saved: ReduxFriendlyStringMap<Variable>;
  editing: Variable | null;
};

const initialState: VariablesState = {
  saved: {},
  editing: null,
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    createNewEditingVariable: (state, action: PayloadAction<Variable>) => {
      state.editing = action.payload;
    },
    selectVariable: (state, action: PayloadAction<string>) => {
      state.editing = state.saved[action.payload];
    },
    saveEditingVariable: (state) => {
      if (state.editing) {
        // TODO: validation
        state.saved[state.editing.id] = state.editing;
      }
    },
    clearEditingVariable: (state) => {
      state.editing = null;
    },
    changeEditingVariableName: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.name = action.payload;
      }
    },
    changeEditingVariableRoleKey: (state, action: PayloadAction<string>) => {
      if (state.editing) {
        state.editing.roleKeyId = action.payload;
      }
    },
    changeEditingVariableType: (
      state,
      action: PayloadAction<ChangeVariableTypePayload>
    ) => {
      // casting here to non-null b/c should not ever be null while editing
      const variable = state.editing as Variable;
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
          throw new UnhandledVariableTypeError(action.payload.variableType);
      }
    },
    changeRangeMin: (state, action: PayloadAction<number>) => {
      const range = state.editing as Range;
      range.beginInclusive = action.payload;
    },
    changeRangeMax: (state, action: PayloadAction<number>) => {
      const range = state.editing as Range;
      range.endInclusive = action.payload;
    },
    addChoiceItem: (state, action: PayloadAction<ChoiceItem>) => {
      if (state.editing) {
        (state.editing as Choice).items.push(action.payload);
      }
    },
    editChoiceItemValue: (
      state,
      action: PayloadAction<EditChoiceItemValuePayload>
    ) => {
      // TODO: validation
      if (state.editing) {
        const choice = state.editing as Choice;
        const choiceItem = choice.items.find(
          (i) => i.id === action.payload.choiceItemId
        ) as ChoiceItem;
        choiceItem.value = action.payload.value;
      }
    },
    removeChoiceItem: (
      state,
      action: PayloadAction<RemoveChoiceItemPayload>
    ) => {
      if (state.editing) {
        const choice = state.editing as Choice;
        choice.items = choice.items.filter(
          (item) => item.id !== action.payload.choiceItemId
        );
      }
    },
  },
});

export const {
  createNewEditingVariable,
  selectVariable,
  clearEditingVariable,
  changeEditingVariableName,
  changeEditingVariableRoleKey,
  changeEditingVariableType,
  saveEditingVariable,
  changeRangeMin,
  changeRangeMax,
  addChoiceItem,
  editChoiceItemValue,
  removeChoiceItem,
} = variablesSlice.actions;
export const variableReducer = variablesSlice.reducer;
