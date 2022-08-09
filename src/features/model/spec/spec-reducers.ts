import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { Spec, SpecItem, VariableSpecItem } from './data/spec-domain';
import { SpecDTO } from './data/spec-dto';
import { specDefaultNamer } from './spec-default-namer';
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
} from './spec-editing-context';
import { SpecItemType } from './spec-item-type';

export type SpecsState = {
  saved: ReduxFriendlyStringMap<SpecDTO>;
  editingId: string | undefined;
};

const initialState: SpecsState = {
  saved: {},
  editingId: undefined,
};

const specItemIdMatches: (
  specItemId: string
) => (specItem: SpecItem) => boolean = (specItemId) => (specItem) =>
  specItem.id === specItemId;

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
    saveEditingSpec: (state, action: PayloadAction<SpecDTO>) => {
      state.saved[action.payload.id] = addDefaults(action.payload);
    },
  },
});

export const { selectSpec, saveEditingSpec } = specsSlice.actions;
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
  return { ...state, roleKeyId: action.payload };
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
            };
          case SpecItemType.Enum.VARIABLE:
            return {
              id: item.id,
              itemType: action.payload.specItemType,
              variableId: action.payload.variableId,
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
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
