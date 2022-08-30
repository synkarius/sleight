import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VariableType } from './variable-types';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
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
  TextVariable,
  isTextVariable,
  isRangeVariable,
  isChoiceVariable,
} from './data/variable';
import { VariableDTO } from './data/variable-dto';
import { Ided, Named, RoleKeyed } from '../../domain';
import { WrongTypeError } from '../../../error/wrong-type-error';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';

export type VariablesState = {
  readonly saved: Record<string, VariableDTO>;
  readonly editingId?: string;
};

const initialState: VariablesState = {
  saved: {},
  editingId: undefined,
};

const injected = getDefaultInjectionContext();
const variableDefaultNamer = injected.default.namers.variable;

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
  state: RangeVariable,
  action: VariableReducerNumberAction
): RangeVariable => {
  return {
    ...state,
    beginInclusive: action.payload,
  };
};

const changeRangeMax = (
  state: RangeVariable,
  action: VariableReducerNumberAction
): RangeVariable => {
  return {
    ...state,
    endInclusive: action.payload,
  };
};

const addChoiceItem = (
  state: ChoiceVariable,
  action: VariableReducerAddChoiceItemAction
): ChoiceVariable => {
  return {
    ...state,
    items: [...state.items, action.payload],
  };
};

const editChoiceItemValue = (
  state: ChoiceVariable,
  action: VariableReducerEditChoiceItemAction
): ChoiceVariable => {
  return {
    ...state,
    items: state.items.map((item) => {
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
  state: ChoiceVariable,
  action: VariableReducerStringAction
): ChoiceVariable => {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== action.payload),
  };
};

const addSelectorItem = (
  state: ChoiceVariable,
  action: VariableReducerAddSelectorItemAction
): ChoiceVariable => {
  return {
    ...state,
    items: state.items.map((choiceItem) => {
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
  state: ChoiceVariable,
  action: VariableReducerChangeSelectorItemAction
): ChoiceVariable => {
  return {
    ...state,
    items: state.items.map((specItem) => {
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
  state: ChoiceVariable,
  action: VariableReducerDeleteSelectorItemAction
): ChoiceVariable => {
  return {
    ...state,
    items: state.items.map((specItem) => {
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

const toggleDefaultEnabled = (state: Variable): Variable => {
  const variableType = state.type;
  switch (variableType) {
    case VariableType.Enum.RANGE:
      return {
        ...state,
        defaultValue: state.defaultValue === undefined ? 0 : undefined,
      };
    case VariableType.Enum.TEXT:
    case VariableType.Enum.CHOICE:
      return {
        ...state,
        defaultValue: state.defaultValue === undefined ? '' : undefined,
      };
    default:
      throw new ExhaustivenessFailureError(variableType);
  }
};

const changeDefaultText = (
  state: TextVariable,
  action: VariableReducerStringAction
): TextVariable => ({
  ...state,
  defaultValue: action.payload,
});

const changeDefaultNumber = (
  state: RangeVariable,
  action: VariableReducerNumberAction
): RangeVariable => ({ ...state, defaultValue: action.payload });

const changeDefaultIndex = (
  state: ChoiceVariable,
  action: VariableReducerStringAction
): ChoiceVariable => ({
  ...state,
  defaultValue: action.payload,
});

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
      if (isRangeVariable(state)) {
        return changeRangeMin(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.CHANGE_RANGE_MAX:
      if (isRangeVariable(state)) {
        return changeRangeMax(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.ADD_CHOICE_ITEM:
      if (isChoiceVariable(state)) {
        return addChoiceItem(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.EDIT_CHOICE_ITEM:
      if (isChoiceVariable(state)) {
        return editChoiceItemValue(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.DELETE_CHOICE_ITEM:
      if (isChoiceVariable(state)) {
        return removeChoiceItem(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.ADD_SELECTOR_ITEM:
      if (isChoiceVariable(state)) {
        return addSelectorItem(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.EDIT_SELECTOR_ITEM:
      if (isChoiceVariable(state)) {
        return changeSelectorItem(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.DELETE_SELECTOR_ITEM:
      if (isChoiceVariable(state)) {
        return deleteSelectorItem(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.TOGGLE_DEFAULT_ENABLED:
      return toggleDefaultEnabled(state);
    case VariableReducerActionType.CHANGE_DEFAULT_TEXT:
      if (isTextVariable(state)) {
        return changeDefaultText(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.CHANGE_DEFAULT_NUMBER:
      if (isRangeVariable(state)) {
        return changeDefaultNumber(state, action);
      }
      throw new WrongTypeError(state.type);
    case VariableReducerActionType.CHANGE_DEFAULT_CHOICE:
      if (isChoiceVariable(state)) {
        return changeDefaultIndex(state, action);
      }
      throw new WrongTypeError(state.type);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
