import {
  createSelector,
  createSelectorItem,
} from '../selector/data/selector-domain';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
  createRangeVariable,
  createTextVariable,
  RangeVariable,
  TextVariable,
} from './data/variable';
import { VariableDTO } from './data/variable-dto';
import { VariableReducerActionType } from './variable-editing-context';
import {
  VariablesState,
  saveEditingVariable,
  selectVariable,
  variableReduxReducer,
  variableReactReducer,
} from './variable-reducers';
import { VariableType } from './variable-types';

const VARIABLE_ID_1 = 'VARIABLE_ID_1';
const VARIABLE_NAME_1 = 'VARIABLE_NAME_1';
const VARIABLE_RK_1 = 'VARIABLE_RK_1';

const createTestVariable = (id: string): VariableDTO => {
  return {
    id: id,
    roleKeyId: undefined,
    name: '',
    type: VariableType.Enum.TEXT,
  };
};

describe('variable reducer', () => {
  const initialState: VariablesState = {
    saved: {},
    editingId: undefined,
  };
  it('should handle initial state', () => {
    expect(variableReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: undefined,
    });
  });

  it('should handle save', () => {
    const obj = {
      ...createTestVariable(VARIABLE_ID_1),
      name: 'asdf',
    };

    const actual = variableReduxReducer(initialState, saveEditingVariable(obj));

    const expected: Record<string, VariableDTO> = {};
    expected[obj.id] = obj;

    expect(actual.saved).toEqual(expected);
  });

  it('should handle save with default name', () => {
    const obj = createTestVariable(VARIABLE_ID_1);

    const actual = variableReduxReducer(initialState, saveEditingVariable(obj));

    const expected: Record<string, VariableDTO> = {};
    expected[obj.id] = { ...obj, name: 'text-var-VARIABLE_ID_1' };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const prereducerState = { saved: {}, editingId: undefined };

    const actual = variableReduxReducer(
      prereducerState,
      selectVariable(VARIABLE_ID_1)
    );
    expect(actual.editingId).toEqual(VARIABLE_ID_1);
  });

  it('should handle clear', () => {
    const prereducerState = { saved: {}, editingId: VARIABLE_ID_1 };

    const actual = variableReduxReducer(prereducerState, selectVariable());
    expect(actual.editingId).toBeUndefined();
  });

  it('should handle change name', () => {
    const obj = createTextVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change name to blank', () => {
    const obj = { ...createTextVariable(), name: '' };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_NAME,
      payload: '       ',
    });

    expect(actual).toEqual({
      ...obj,
      name: '',
    });
  });

  it('should handle change role key', () => {
    const obj = createTextVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type to text', () => {
    const obj: RangeVariable = {
      ...createRangeVariable(),
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_TYPE,
      payload: { variableType: VariableType.Enum.TEXT },
    });

    expect(actual).toEqual({
      ...createTextVariable(),
      id: obj.id,
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    });
  });

  it('should handle change type to range', () => {
    const obj = {
      ...createTextVariable(),
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_TYPE,
      payload: { variableType: VariableType.Enum.RANGE },
    });

    expect(actual).toEqual({
      ...createRangeVariable(),
      id: obj.id,
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    });
  });

  it('should handle change type to choice', () => {
    const obj = {
      ...createRangeVariable(),
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    };
    const selector = createSelector();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_TYPE,
      payload: { variableType: VariableType.Enum.CHOICE, selector },
    });

    expect(actual).toEqual({
      ...createChoiceVariable(),
      id: obj.id,
      name: VARIABLE_NAME_1,
      roleKeyId: VARIABLE_RK_1,
    });
  });

  it('should handle change range min', () => {
    const obj = createRangeVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_RANGE_MIN,
      payload: 2,
    });

    expect(actual).toEqual({
      ...obj,
      beginInclusive: 2,
    });
  });

  it('should handle change range max', () => {
    const obj = createRangeVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_RANGE_MAX,
      payload: 23,
    });

    expect(actual).toEqual({
      ...obj,
      endInclusive: 23,
    });
  });

  it('should handle add choice item', () => {
    const obj = createChoiceVariable();
    const newSelector1 = createSelector();
    const newChoiceItem1 = createChoiceItem(newSelector1);

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.ADD_CHOICE_ITEM,
      payload: newChoiceItem1,
    });

    expect(actual).toEqual({
      ...obj,
      items: [newChoiceItem1],
    });
  });

  it('should handle edit choice item', () => {
    const newSelector1 = createSelector();
    const newChoiceItem1 = createChoiceItem(newSelector1);
    const obj: ChoiceVariable = {
      ...createChoiceVariable(),
      items: [newChoiceItem1],
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.EDIT_CHOICE_ITEM,
      payload: {
        choiceItemId: newChoiceItem1.id,
        value: 'asdf',
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [{ ...newChoiceItem1, value: 'asdf' }],
    });
  });

  it('should handle delete choice item', () => {
    const newSelector1 = createSelector();
    const newChoiceItem1 = createChoiceItem(newSelector1);
    const obj: ChoiceVariable = {
      ...createChoiceVariable(),
      items: [newChoiceItem1],
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.DELETE_CHOICE_ITEM,
      payload: newChoiceItem1.id,
    });

    expect(actual).toEqual({
      ...obj,
      items: [],
    });
  });

  it('should handle add selector item', () => {
    const selector1 = createSelector();
    const choiceItem1 = createChoiceItem(selector1);
    const obj: ChoiceVariable = {
      ...createChoiceVariable(),
      items: [choiceItem1],
    };

    const selectorItem2 = createSelectorItem();
    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.ADD_SELECTOR_ITEM,
      payload: {
        choiceItemId: choiceItem1.id,
        selectorItem: selectorItem2,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [
        {
          ...choiceItem1,
          selector: {
            ...selector1,
            items: [...selector1.items, selectorItem2],
          },
        },
      ],
    });
  });

  it('should handle edit selector item', () => {
    const selector1 = createSelector();
    const choiceItem1 = createChoiceItem(selector1);
    const obj: ChoiceVariable = {
      ...createChoiceVariable(),
      items: [choiceItem1],
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.EDIT_SELECTOR_ITEM,
      payload: {
        choiceItemId: choiceItem1.id,
        selectorItemId: selector1.items[0].id,
        value: 'asdf',
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [
        {
          ...choiceItem1,
          selector: {
            ...selector1,
            items: [{ ...selector1.items[0], value: 'asdf' }],
          },
        },
      ],
    });
  });

  it('should handle delete selector item', () => {
    const selector1 = createSelector();
    const choiceItem1 = createChoiceItem(selector1);
    const obj: ChoiceVariable = {
      ...createChoiceVariable(),
      items: [choiceItem1],
    };

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.DELETE_SELECTOR_ITEM,
      payload: {
        choiceItemId: choiceItem1.id,
        selectorItemId: selector1.items[0].id,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [
        {
          ...choiceItem1,
          selector: {
            ...selector1,
            items: [],
          },
        },
      ],
    });
  });

  it('should handle toggle text variable default', () => {
    const objDefaultDisabled: TextVariable = {
      ...createTextVariable(),
      defaultValue: undefined,
    };

    const actualEnabled = variableReactReducer(objDefaultDisabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualEnabled.defaultValue).not.toBeUndefined();

    const objDefaultEnabled: TextVariable = {
      ...createTextVariable(),
      defaultValue: '',
    };

    const actualDisabled = variableReactReducer(objDefaultEnabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualDisabled.defaultValue).toBeUndefined();
  });

  it('should handle toggle range variable default', () => {
    const objDefaultDisabled: RangeVariable = {
      ...createRangeVariable(),
      defaultValue: undefined,
    };

    const actualEnabled = variableReactReducer(objDefaultDisabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualEnabled.defaultValue).not.toBeUndefined();

    const objDefaultEnabled: RangeVariable = {
      ...createRangeVariable(),
      defaultValue: 0,
    };

    const actualDisabled = variableReactReducer(objDefaultEnabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualDisabled.defaultValue).toBeUndefined();
  });

  it('should handle toggle choice variable default', () => {
    const objDefaultDisabled: ChoiceVariable = {
      ...createChoiceVariable(),
      defaultValue: undefined,
    };

    const actualEnabled = variableReactReducer(objDefaultDisabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualEnabled.defaultValue).not.toBeUndefined();

    const objDefaultEnabled: ChoiceVariable = {
      ...createChoiceVariable(),
      defaultValue: '',
    };

    const actualDisabled = variableReactReducer(objDefaultEnabled, {
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });

    expect(actualDisabled.defaultValue).toBeUndefined();
  });

  it('should handle change text variable default', () => {
    const obj = createTextVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_DEFAULT_TEXT,
      payload: 'asdf',
    });

    expect(actual.defaultValue).toBe('asdf');
  });

  it('should handle change range variable default', () => {
    const obj = createRangeVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_DEFAULT_NUMBER,
      payload: 10,
    });

    expect(actual.defaultValue).toBe(10);
  });

  it('should handle change choice variable default', () => {
    const obj = createChoiceVariable();

    const actual = variableReactReducer(obj, {
      type: VariableReducerActionType.CHANGE_DEFAULT_CHOICE,
      payload: 'asdf',
    });

    expect(actual.defaultValue).toBe('asdf');
  });
});
