import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { VariableType } from './variable-types';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import {
  VariableReducerAction,
  VariableReducerActionType,
  VariableReducerAddChoiceItemAction,
  VariableReducerAddSelectorItemAction,
  VariableReducerChangeSelectorItemAction,
  VariableReducerDeleteSelectorItemAction,
  VariableReducerEditChoiceItemAction,
  VariableReducerNumberAction,
  VariableReducerStringAction,
  VariableReducerVariableTypeAction,
} from './variable-editing-context';
import {
  createRangeVariable,
  createTextVariable,
  createChoiceVariable,
  Variable,
  RangeVariable,
  ChoiceVariable,
} from './data/variable';
import { VariableDTO } from './data/variable-dto';
import { Ided, Named, RoleKeyed } from '../../domain';
import { variableDefaultNamer } from './variable-default-namer';

export type VariablesState = {
  saved: ReduxFriendlyStringMap<VariableDTO>;
  editingId: string | undefined;
};

const initialState: VariablesState = {
  saved: {},
  editingId: undefined,
};

const addDefaults = (variable: VariableDTO): VariableDTO => {
  return {
    ...variable,
    name: variable.name.trim() || variableDefaultNamer.getDefaultName(variable),
  };
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    selectVariable: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveEditingVariable: (state, action: PayloadAction<VariableDTO>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
  },
});

export const { saveEditingVariable, selectVariable } = variablesSlice.actions;
export const variableReduxReducer = variablesSlice.reducer;

const copyVariable = (
  variable: Ided & Named & RoleKeyed
): Ided & Named & RoleKeyed => {
  return {
    roleKeyId: variable.roleKeyId,
    id: variable.id,
    name: variable.name,
  };
};

const changeEditingVariableName = (
  state: Variable,
  action: VariableReducerStringAction
): Variable => {
  return {
    ...state,
    name: action.payload.trim() === '' ? '' : action.payload,
  };
};

const changeEditingVariableRoleKey = (
  state: Variable,
  action: VariableReducerStringAction
): Variable => {
  return {
    ...state,
    roleKeyId: action.payload,
  };
};

const changeEditingVariableType = (
  state: Variable,
  action: VariableReducerVariableTypeAction
): Variable => {
  const variableType = action.payload.variableType;
  switch (variableType) {
    case VariableType.Enum.TEXT:
      return { ...createTextVariable(), ...copyVariable(state) };
    case VariableType.Enum.RANGE:
      return { ...createRangeVariable(), ...copyVariable(state) };
    case VariableType.Enum.CHOICE:
      return { ...createChoiceVariable(), ...copyVariable(state) };
    default:
      throw new ExhaustivenessFailureError(variableType);
  }
};

const changeRangeMin = (
  state: Variable,
  action: VariableReducerNumberAction
): Variable => {
  return {
    ...(state as RangeVariable),
    beginInclusive: action.payload,
  };
};

const changeRangeMax = (
  state: Variable,
  action: VariableReducerNumberAction
): Variable => {
  return {
    ...(state as RangeVariable),
    endInclusive: action.payload,
  };
};

const addChoiceItem = (
  state: Variable,
  action: VariableReducerAddChoiceItemAction
): Variable => {
  const choiceVariable = state as ChoiceVariable;
  return {
    ...choiceVariable,
    items: [...choiceVariable.items, action.payload],
  };
};

const editChoiceItemValue = (
  state: Variable,
  action: VariableReducerEditChoiceItemAction
): Variable => {
  const choice = state as ChoiceVariable;
  return {
    ...choice,
    items: choice.items.map((item) => {
      if (item.id === action.payload.choiceItemId) {
        return {
          ...item,
          value: action.payload.value,
        };
      }
      return item;
    }),
  };
};

const removeChoiceItem = (
  state: Variable,
  action: VariableReducerStringAction
): Variable => {
  const choice = state as ChoiceVariable;
  return {
    ...choice,
    items: choice.items.filter((item) => item.id !== action.payload),
  };
};

const addSelectorItem = (
  state: Variable,
  action: VariableReducerAddSelectorItemAction
): Variable => {
  const choiceVariable = state as ChoiceVariable;
  return {
    ...choiceVariable,
    items: choiceVariable.items.map((choiceItem) => {
      if (choiceItem.id === action.payload.choiceItemId) {
        return {
          ...choiceItem,
          selector: {
            ...choiceItem.selector,
            items: [...choiceItem.selector.items, action.payload.selectorItem],
          },
        };
      }
      return choiceItem;
    }),
  };
};

const changeSelectorItem = (
  state: Variable,
  action: VariableReducerChangeSelectorItemAction
): Variable => {
  const choiceVariable = state as ChoiceVariable;
  return {
    ...choiceVariable,
    items: choiceVariable.items.map((specItem) => {
      if (specItem.id === action.payload.choiceItemId) {
        return {
          ...specItem,
          selector: {
            ...specItem.selector,
            items: specItem.selector.items.map((selectorItem) => {
              if (selectorItem.id === action.payload.selectorItemId) {
                return {
                  ...selectorItem,
                  value: action.payload.value,
                };
              }
              return selectorItem;
            }),
          },
        };
      }
      return specItem;
    }),
  };
};

const deleteSelectorItem = (
  state: Variable,
  action: VariableReducerDeleteSelectorItemAction
): Variable => {
  const choiceVariable = state as ChoiceVariable;
  return {
    ...choiceVariable,
    items: choiceVariable.items.map((specItem) => {
      if (specItem.id === action.payload.choiceItemId) {
        return {
          ...specItem,
          selector: {
            ...specItem.selector,
            items: specItem.selector.items.filter(
              (selectorItem) =>
                selectorItem.id !== action.payload.selectorItemId
            ),
          },
        };
      }
      return specItem;
    }),
  };
};

export const variableReactReducer = (
  state: Variable,
  action: VariableReducerAction
): Variable => {
  const actionType = action.type;
  switch (actionType) {
    case VariableReducerActionType.CHANGE_NAME:
      return changeEditingVariableName(state, action);
    case VariableReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingVariableRoleKey(state, action);
    case VariableReducerActionType.CHANGE_TYPE:
      return changeEditingVariableType(state, action);
    case VariableReducerActionType.CHANGE_RANGE_MIN:
      return changeRangeMin(state, action);
    case VariableReducerActionType.CHANGE_RANGE_MAX:
      return changeRangeMax(state, action);
    case VariableReducerActionType.ADD_CHOICE_ITEM:
      return addChoiceItem(state, action);
    case VariableReducerActionType.EDIT_CHOICE_ITEM:
      return editChoiceItemValue(state, action);
    case VariableReducerActionType.DELETE_CHOICE_ITEM:
      return removeChoiceItem(state, action);
    case VariableReducerActionType.ADD_SELECTOR_ITEM:
      return addSelectorItem(state, action);
    case VariableReducerActionType.EDIT_SELECTOR_ITEM:
      return changeSelectorItem(state, action);
    case VariableReducerActionType.DELETE_SELECTOR_ITEM:
      return deleteSelectorItem(state, action);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
