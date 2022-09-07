import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { MoveDirection } from '../common/move-direction';
import {
  Spec,
  SpecItem,
  VariableSpecItem,
} from '../../data/model/spec/spec-domain';
import { SpecDTO } from '../../data/model/spec/spec-dto';
import {
  SpecReducerStringAction,
  SpecReducerActionType,
  SpecReducerAddAction,
  SpecReducerChangeSpecItemTypeAction,
  SpecReducerChangeSpecItemVariableIdAction,
  SpecReducerChangeSpecItemOrderAction,
  SpecReducerAction,
  SpecReducerAddSelectorItemAction,
  SpecReducerChangeSelectorItemAction,
  SpecReducerDeleteSelectorItemAction,
} from '../../ui/model/spec/spec-editing-context';
import { SpecItemType } from '../../data/model/spec/spec-item-type';

export type SpecsState = {
  readonly saved: Record<string, SpecDTO>;
  readonly editingId?: string;
};

const initialState: SpecsState = {
  saved: {},
  editingId: undefined,
};

const specItemIdMatches: (
  specItemId: string
) => (specItem: SpecItem) => boolean = (specItemId) => (specItem) =>
  specItem.id === specItemId;

const injected = getDefaultInjectionContext();
const specDefaultNamer = injected.default.namers.spec;

const addDefaults = (spec: SpecDTO): SpecDTO => {
  return {
    ...spec,
    name: spec.name.trim() || specDefaultNamer.getDefaultName(spec),
  };
};

const specsSlice = createSlice({
  name: 'specs',
  initialState,
  reducers: {
    selectSpec: (state, action: PayloadAction<string | undefined>) => {
      state.editingId = action.payload;
    },
    saveSpec: (state, action: PayloadAction<SpecDTO>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
    deleteSpec: (state, action: PayloadAction<string>) => {
      delete state.saved[action.payload];
    },
  },
});

export const { selectSpec, saveSpec, deleteSpec } = specsSlice.actions;
export const specReduxReducer = specsSlice.reducer;

const changeEditingSpecName = (
  state: Spec,
  action: SpecReducerStringAction
): Spec => {
  return {
    ...state,
    name: action.payload.trim() === '' ? '' : action.payload,
  };
};
const changeEditingSpecRoleKey = (
  state: Spec,
  action: SpecReducerStringAction
): Spec => {
  return { ...state, roleKey: action.payload };
};
const addSpecItem = (state: Spec, action: SpecReducerAddAction): Spec => {
  return {
    ...state,
    items: [...state.items, action.payload],
  };
};
const changeSpecItemType = (
  state: Spec,
  action: SpecReducerChangeSpecItemTypeAction
): Spec => {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id === action.payload.specItemId) {
        const specItemType = action.payload.specItemType;
        switch (specItemType) {
          case SpecItemType.Enum.SELECTOR:
            return {
              id: item.id,
              itemType: action.payload.specItemType,
              selector: action.payload.selector,
              optional: false,
              grouped: false,
            };
          case SpecItemType.Enum.VARIABLE:
            return {
              id: item.id,
              itemType: action.payload.specItemType,
              variableId: action.payload.variableId,
              optional: false,
              grouped: false,
            };
          default:
            throw new ExhaustivenessFailureError(specItemType);
        }
      }
      return item;
    }),
  };
};
const changeSpecItemVariableId = (
  state: Spec,
  action: SpecReducerChangeSpecItemVariableIdAction
): Spec => {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id === action.payload.specItemId) {
        const variableSpecItem = item as VariableSpecItem;
        return {
          ...variableSpecItem,
          variableId: action.payload.variableId,
        };
      }
      return item;
    }),
  };
};
const changeSpecItemOrder = (
  state: Spec,
  action: SpecReducerChangeSpecItemOrderAction
): Spec => {
  const stateItemsCopy = [...state.items];
  const specItem = stateItemsCopy.find(
    specItemIdMatches(action.payload.specItemId)
  );
  const specItemIndex = stateItemsCopy.findIndex(
    specItemIdMatches(action.payload.specItemId)
  );
  if (specItem) {
    const newIndex =
      action.payload.moveDirection === MoveDirection.UP
        ? specItemIndex - 1
        : specItemIndex + 1;
    if (newIndex >= 0 && newIndex < stateItemsCopy.length) {
      const displaced = stateItemsCopy[newIndex];
      stateItemsCopy[newIndex] = specItem;
      stateItemsCopy[specItemIndex] = displaced;
      return { ...state, items: stateItemsCopy };
    }
  }
  return { ...state };
};
const deleteSpecItem = (state: Spec, action: SpecReducerStringAction) => {
  if (state.items.length > 1) {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== action.payload),
    };
  }
  return { ...state };
};
const addSelectorItem = (
  state: Spec,
  action: SpecReducerAddSelectorItemAction
): Spec => {
  return {
    ...state,
    items: state.items.map((specItem) => {
      if (
        specItem.id === action.payload.specItemId &&
        specItem.itemType === SpecItemType.Enum.SELECTOR
      ) {
        return {
          ...specItem,
          selector: {
            ...specItem.selector,
            items: [...specItem.selector.items, action.payload.selectorItem],
          },
        };
      }
      return specItem;
    }),
  };
};
const changeSelectorItem = (
  state: Spec,
  action: SpecReducerChangeSelectorItemAction
): Spec => {
  return {
    ...state,
    items: state.items.map((specItem) => {
      if (
        specItem.id === action.payload.specItemId &&
        specItem.itemType === SpecItemType.Enum.SELECTOR
      ) {
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
  state: Spec,
  action: SpecReducerDeleteSelectorItemAction
): Spec => {
  return {
    ...state,
    items: state.items.map((specItem) => {
      if (
        specItem.id === action.payload.specItemId &&
        specItem.itemType === SpecItemType.Enum.SELECTOR
      ) {
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

const toggleSpecItemOptional = (
  state: Spec,
  action: SpecReducerStringAction
): Spec => {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id === action.payload) {
        const toggledOptional = !item.optional;
        return {
          ...item,
          optional: toggledOptional,
          grouped: toggledOptional ? item.grouped : false,
        };
      }
      return item;
    }),
  };
};

const toggleSpecItemGrouped = (
  state: Spec,
  action: SpecReducerStringAction
): Spec => {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id === action.payload) {
        return {
          ...item,
          grouped: !item.grouped,
        };
      }
      return item;
    }),
  };
};

const toggleEditingSpecEnabled = (state: Spec): Spec => ({
  ...state,
  enabled: !state.enabled,
});

const toggleEditingSpecLocked = (state: Spec): Spec => ({
  ...state,
  locked: !state.locked,
});

export const specReactReducer = (
  state: Spec,
  action: SpecReducerAction
): Spec => {
  const actionType = action.type;
  switch (actionType) {
    case SpecReducerActionType.CHANGE_NAME:
      return changeEditingSpecName(state, action);
    case SpecReducerActionType.CHANGE_ROLE_KEY:
      return changeEditingSpecRoleKey(state, action);
    case SpecReducerActionType.ADD_SPEC_ITEM:
      return addSpecItem(state, action);
    case SpecReducerActionType.CHANGE_SPEC_ITEM_TYPE:
      return changeSpecItemType(state, action);
    case SpecReducerActionType.CHANGE_SPEC_ITEM_VARIABLE_ID:
      return changeSpecItemVariableId(state, action);
    case SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER:
      return changeSpecItemOrder(state, action);
    case SpecReducerActionType.DELETE_SPEC_ITEM:
      return deleteSpecItem(state, action);
    case SpecReducerActionType.ADD_SELECTOR_ITEM:
      return addSelectorItem(state, action);
    case SpecReducerActionType.CHANGE_SELECTOR_ITEM:
      return changeSelectorItem(state, action);
    case SpecReducerActionType.DELETE_SELECTOR_ITEM:
      return deleteSelectorItem(state, action);
    case SpecReducerActionType.TOGGLE_SPEC_ITEM_OPTIONAL:
      return toggleSpecItemOptional(state, action);
    case SpecReducerActionType.TOGGLE_SPEC_ITEM_GROUPED:
      return toggleSpecItemGrouped(state, action);
    case SpecReducerActionType.TOGGLE_ENABLED:
      return toggleEditingSpecEnabled(state);
    case SpecReducerActionType.TOGGLE_LOCKED:
      return toggleEditingSpecLocked(state);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
