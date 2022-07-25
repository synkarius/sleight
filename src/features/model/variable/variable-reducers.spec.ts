import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { createChoice, createChoiceItem } from './choice/choice';
import { createRange } from './range/range';
import { createText } from './text/text';
import { Variable } from './variable';
import {
  VariablesState,
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
  variableReducer,
} from './variable-reducers';
import { VariableType } from './variable-types';

const createTestVariable = (id: string): Variable => {
  return {
    id: id,
    roleKeyId: null,
    name: '',
    type: VariableType.Enum.TEXT,
  };
};

describe('role key reducer', () => {
  const initialState: VariablesState = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(variableReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newObject = createText();

    const actual = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    expect(actual.editing).toEqual(createTestVariable(newObject.id));
  });

  it('should handle save', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );
    const actual = variableReducer(createdState, saveEditingVariable());

    const expected: ReduxFriendlyStringMap<Variable> = {};
    expected[newObject.id] = createTestVariable(newObject.id);

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );
    const savedState = variableReducer(createdState, saveEditingVariable());
    const clearedState = variableReducer(savedState, clearEditingVariable());

    const actual = variableReducer(clearedState, selectVariable(newObject.id));
    expect(actual.editing).toEqual(createTestVariable(newObject.id));
  });

  it('should handle clear', () => {
    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(createText())
    );

    const actual = variableReducer(createdState, clearEditingVariable());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(
      createdState,
      changeEditingVariableName('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestVariable(newObject.id),
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(
      createdState,
      changeEditingVariableRoleKey('asdf')
    );
    expect(actual.editing).toEqual({
      ...createTestVariable(newObject.id),
      roleKeyId: 'asdf',
    });
  });

  it('should handle change type to text', () => {
    const newObject = createRange();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(
      createdState,
      changeEditingVariableType({
        variableType: VariableType.Enum.TEXT,
        selectorId: null,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestVariable(newObject.id),
      type: VariableType.Enum.TEXT,
    });
  });

  it('should handle change type to range', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(
      createdState,
      changeEditingVariableType({
        variableType: VariableType.Enum.RANGE,
        selectorId: null,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestVariable(newObject.id),
      type: VariableType.Enum.RANGE,
      beginInclusive: 0,
      endInclusive: 9,
    });
  });

  it('should handle change type to choice', () => {
    const newObject = createText();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(
      createdState,
      changeEditingVariableType({
        variableType: VariableType.Enum.CHOICE,
        selectorId: 'asdf',
      })
    );
    expect(actual.editing).toEqual({
      ...createTestVariable(newObject.id),
      type: VariableType.Enum.CHOICE,
      items: [
        {
          roleKeyId: null,
          id: expect.any(String),
          selectorId: 'asdf',
          value: '',
        },
      ],
    });
  });

  it('should handle change range min', () => {
    const newObject = createRange();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(createdState, changeRangeMin(5));
    expect(actual.editing).toEqual({
      ...newObject,
      beginInclusive: 5,
    });
  });

  it('should handle change range max', () => {
    const newObject = createRange();

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newObject)
    );

    const actual = variableReducer(createdState, changeRangeMax(5));
    expect(actual.editing).toEqual({
      ...newObject,
      endInclusive: 5,
    });
  });

  it('should handle add choice item', () => {
    const newChoice1 = createChoice('some-selector-id-1');
    const newChoiceItem2 = createChoiceItem('some-selector-item-2');

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newChoice1)
    );

    const actual = variableReducer(createdState, addChoiceItem(newChoiceItem2));
    expect(actual.editing).toEqual({
      ...newChoice1,
      items: [newChoice1.items[0], newChoiceItem2],
    });
  });

  it('should handle edit choice item', () => {
    const newChoice1 = createChoice('some-selector-id-1');

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newChoice1)
    );

    const actual = variableReducer(
      createdState,
      editChoiceItemValue({
        choiceItemId: newChoice1.items[0].id,
        value: 'asdf',
      })
    );
    expect(actual.editing).toEqual({
      ...newChoice1,
      items: [{ ...newChoice1.items[0], value: 'asdf' }],
    });
  });

  it('should handle delete choice item', () => {
    const newChoice1 = createChoice('some-selector-id-1');

    const createdState = variableReducer(
      initialState,
      createNewEditingVariable(newChoice1)
    );

    const actual = variableReducer(
      createdState,
      removeChoiceItem({ choiceItemId: newChoice1.items[0].id })
    );
    expect(actual.editing).toEqual({
      ...newChoice1,
      items: [],
    });
  });
});
