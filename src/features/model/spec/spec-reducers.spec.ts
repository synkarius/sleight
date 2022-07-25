import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { createSpec, createSpecItem, Spec } from './spec';
import { SpecItemType } from './spec-item-type';
import {
  SpecsState,
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
  deleteSpecItem,
  specReducer,
} from './spec-reducers';

const createTestSpec = (
  id: string,
  specItemId: string,
  selectorId: string
): Spec => {
  return {
    id: id,
    name: '',
    roleKeyId: null,
    items: [
      {
        id: specItemId,
        itemId: selectorId,
        itemType: SpecItemType.Enum.SELECTOR,
      },
    ],
  };
};

describe('role key reducer', () => {
  const initialState: SpecsState = {
    saved: {},
    editing: null,
  };
  it('should handle initial state', () => {
    expect(specReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editing: null,
    });
  });

  it('should handle create new', () => {
    const newObject = createSpec('some-selector-id-1');

    const actual = specReducer(initialState, createNewEditingSpec(newObject));

    expect(actual.editing).toEqual(
      createTestSpec(
        newObject.id,
        newObject.items[0].id,
        newObject.items[0].itemId
      )
    );
  });

  it('should handle save', () => {
    const newObject = createSpec('some-selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newObject)
    );
    const actual = specReducer(createdState, saveEditingSpec());

    const expected: ReduxFriendlyStringMap<Spec> = {};
    expected[newObject.id] = createTestSpec(
      newObject.id,
      newObject.items[0].id,
      newObject.items[0].itemId
    );

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const newObject = createSpec('some-selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newObject)
    );
    const savedState = specReducer(createdState, saveEditingSpec());
    const clearedState = specReducer(savedState, clearEditingSpec());

    const actual = specReducer(clearedState, selectSpec(newObject.id));
    expect(actual.editing).toEqual(
      createTestSpec(
        newObject.id,
        newObject.items[0].id,
        newObject.items[0].itemId
      )
    );
  });

  it('should handle clear', () => {
    const createdState = specReducer(
      initialState,
      createNewEditingSpec(createSpec('some-selector-id-1'))
    );

    const actual = specReducer(createdState, clearEditingSpec());

    expect(actual.editing).toBeNull();
  });

  it('should handle change name', () => {
    const newObject = createSpec('some-selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newObject)
    );

    const actual = specReducer(createdState, changeEditingSpecName('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newObject.id,
        newObject.items[0].id,
        newObject.items[0].itemId
      ),
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const newObject = createSpec('some-selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newObject)
    );

    const actual = specReducer(createdState, changeEditingSpecRoleKey('asdf'));
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newObject.id,
        newObject.items[0].id,
        newObject.items[0].itemId
      ),
      roleKeyId: 'asdf',
    });
  });

  it('should handle add spec item', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem1 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );

    const actual = specReducer(createdState, addSpecItem(newSpecItem1));
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpec1.items[0], newSpecItem1],
    });
  });

  it('should handle change spec item type', () => {
    const newSpec1 = createSpec('selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );

    const actual = specReducer(
      createdState,
      changeSpecItemType({
        specItemId: newSpec1.items[0].id,
        specItemItemId: 'variable-id-1',
        specItemItemType: SpecItemType.Enum.VARIABLE,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [
        {
          ...newSpec1.items[0],
          itemId: 'variable-id-1',
          itemType: SpecItemType.Enum.VARIABLE,
        },
      ],
    });
  });

  it('should handle change spec item variable id', () => {
    const newSpec1 = createSpec('selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const typeChangedState = specReducer(
      createdState,
      changeSpecItemType({
        specItemId: newSpec1.items[0].id,
        specItemItemId: 'variable-id-1',
        specItemItemType: SpecItemType.Enum.VARIABLE,
      })
    );

    const actual = specReducer(
      typeChangedState,
      changeSpecItemVariableId({
        specItemId: newSpec1.items[0].id,
        variableId: 'variable-id-2',
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [
        {
          ...newSpec1.items[0],
          itemId: 'variable-id-2',
          itemType: SpecItemType.Enum.VARIABLE,
        },
      ],
    });
  });

  it('should handle move spec item up', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem2 = createSpecItem(
      'variable-id-1',
      SpecItemType.Enum.VARIABLE
    );
    const newSpecItem3 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const addedState1 = specReducer(createdState, addSpecItem(newSpecItem2));
    const addedState2 = specReducer(addedState1, addSpecItem(newSpecItem3));

    const actual = specReducer(
      addedState2,
      changeSpecItemOrder({
        specItemId: newSpecItem2.id,
        moveDirection: MoveDirection.UP,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpecItem2, newSpec1.items[0], newSpecItem3],
    });
  });

  it('should handle move spec item down', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem2 = createSpecItem(
      'variable-id-1',
      SpecItemType.Enum.VARIABLE
    );
    const newSpecItem3 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const addedState1 = specReducer(createdState, addSpecItem(newSpecItem2));
    const addedState2 = specReducer(addedState1, addSpecItem(newSpecItem3));

    const actual = specReducer(
      addedState2,
      changeSpecItemOrder({
        specItemId: newSpecItem2.id,
        moveDirection: MoveDirection.DOWN,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpec1.items[0], newSpecItem3, newSpecItem2],
    });
  });

  it('should handle move spec item up out of bounds', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem2 = createSpecItem(
      'variable-id-1',
      SpecItemType.Enum.VARIABLE
    );
    const newSpecItem3 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const addedState1 = specReducer(createdState, addSpecItem(newSpecItem2));
    const addedState2 = specReducer(addedState1, addSpecItem(newSpecItem3));

    const actual = specReducer(
      addedState2,
      changeSpecItemOrder({
        specItemId: newSpec1.items[0].id,
        moveDirection: MoveDirection.UP,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpec1.items[0], newSpecItem2, newSpecItem3],
    });
  });

  it('should handle move spec item down out of bounds', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem2 = createSpecItem(
      'variable-id-1',
      SpecItemType.Enum.VARIABLE
    );
    const newSpecItem3 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const addedState1 = specReducer(createdState, addSpecItem(newSpecItem2));
    const addedState2 = specReducer(addedState1, addSpecItem(newSpecItem3));

    const actual = specReducer(
      addedState2,
      changeSpecItemOrder({
        specItemId: newSpecItem3.id,
        moveDirection: MoveDirection.DOWN,
      })
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpec1.items[0], newSpecItem2, newSpecItem3],
    });
  });

  it('should handle delete spec item', () => {
    const newSpec1 = createSpec('selector-id-1');
    const newSpecItem1 = createSpecItem(
      'selector-id-2',
      SpecItemType.Enum.SELECTOR
    );

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );
    const addedState = specReducer(createdState, addSpecItem(newSpecItem1));

    const actual = specReducer(
      addedState,
      deleteSpecItem(newSpec1.items[0].id)
    );

    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpecItem1],
    });
  });

  it('should handle delete last spec item', () => {
    const newSpec1 = createSpec('selector-id-1');

    const createdState = specReducer(
      initialState,
      createNewEditingSpec(newSpec1)
    );

    const actual = specReducer(
      createdState,
      deleteSpecItem(newSpec1.items[0].id)
    );
    expect(actual.editing).toEqual({
      ...createTestSpec(
        newSpec1.id,
        newSpec1.items[0].id,
        newSpec1.items[0].itemId
      ),
      items: [newSpec1.items[0]],
    });
  });
});
