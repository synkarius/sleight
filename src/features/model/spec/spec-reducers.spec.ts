import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { MoveDirection } from '../common/move-direction';
import { createSpec, createSpecItem } from './data/spec-domain';
import { SpecRedux } from './data/spec-redux';
import { SpecReducerActionType } from './spec-editing-context';
import { SpecItemType } from './spec-item-type';
import {
  SpecsState,
  selectSpec,
  saveEditingSpec,
  specReduxReducer,
  specReactReducer,
} from './spec-reducers';

const createTestSpecRedux = (from?: {
  id?: string;
  specItemId?: string;
  selectorId?: string;
}): SpecRedux => {
  return {
    id: from?.id ?? 'asdf-id',
    name: '',
    roleKeyId: null,
    items: [
      {
        id: from?.specItemId ?? 'asdf-id',
        itemId: from?.selectorId ?? 'asdf-spec-item-id',
        itemType: SpecItemType.Enum.SELECTOR,
      },
    ],
  };
};

describe('spec reducer', () => {
  const initialState: SpecsState = {
    saved: {},
    editingId: undefined,
  };
  it('should handle initial state', () => {
    expect(specReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editingId: undefined,
    });
  });

  // it('should handle create new', () => {
  //   const newObject = createSpec('some-selector-id-1');

  //   const actual = specReduxReducer(
  //     initialState,
  //     createNewEditingSpec(newObject)
  //   );

  //   expect(actual.editing).toEqual(
  //     createTestSpec(
  //       newObject.id,
  //       newObject.items[0].id,
  //       newObject.items[0].itemId
  //     )
  //   );
  // });

  it('should handle save', () => {
    const obj = createTestSpecRedux({
      id: 'some-id',
      specItemId: 'some-spec-item-id',
      selectorId: 'some-selector-id',
    });

    const prereducerState: SpecsState = {
      saved: {},
      editingId: undefined,
    };
    const actual = specReduxReducer(prereducerState, saveEditingSpec(obj));

    const expected: ReduxFriendlyStringMap<SpecRedux> = {};
    expected[obj.id] = createTestSpecRedux({
      id: obj.id,
      specItemId: obj.items[0].id,
      selectorId: obj.items[0].itemId,
    });

    expect(actual.saved).toEqual(expected);
  });

  it('should handle select', () => {
    const obj = createTestSpecRedux({
      id: 'some-id',
    });
    const prereducerState: SpecsState = {
      saved: {},
      editingId: undefined,
    };

    const actual = specReduxReducer(prereducerState, selectSpec(obj.id));
    expect(actual).toEqual({ saved: {}, editingId: obj.id });
  });

  it('should handle clear', () => {
    const prereducerState: SpecsState = {
      saved: {},
      editingId: 'asdf-id',
    };
    const actual = specReduxReducer(prereducerState, selectSpec(undefined));

    expect(actual.editingId).toBeUndefined();
  });

  it('should handle change name', () => {
    const obj = { ...createSpec(), id: 'some-selector-id-1' };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change role key', () => {
    const obj = { ...createSpec(), id: 'some-selector-id-1' };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_ROLE_KEY,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      roleKeyId: 'asdf',
    });
  });

  it('should handle add spec item', () => {
    const obj = {
      ...createSpec(),
      id: 'some-selector-id-1',
      items: [createSpecItem()],
    };

    const newSpecItem = createSpecItem();
    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.ADD_SPEC_ITEM,
      payload: newSpecItem,
    });

    expect(actual).toEqual({
      ...obj,
      items: [...obj.items, newSpecItem],
    });
  });

  it('should handle change spec item type', () => {
    const obj = {
      ...createSpec(),
      items: [createSpecItem()],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_TYPE,
      payload: {
        specItemId: obj.items[0].id,
        specItemType: SpecItemType.Enum.VARIABLE,
        variableId: 'asdf-variable-id',
      },
    });

    expect(actual).toEqual({
      ...createSpec(),
      id: obj.id,
      items: [
        {
          id: obj.items[0].id,
          itemType: SpecItemType.Enum.VARIABLE,
          variableId: 'asdf-variable-id',
        },
      ],
    });
  });

  it('should handle change spec item variable id', () => {
    const orig = createSpec();
    const obj = {
      ...orig,
      items: [
        {
          id: 'asdf-item-id-1',
          itemType: SpecItemType.Enum.VARIABLE,
          variableId: 'asdf-variable-id-1',
        },
      ],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_VARIABLE_ID,
      payload: {
        specItemId: 'asdf-item-id-1',
        variableId: 'asdf-variable-id-2',
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [
        {
          id: 'asdf-item-id-1',
          itemType: SpecItemType.Enum.VARIABLE,
          variableId: 'asdf-variable-id-2',
        },
      ],
    });
  });

  it('should handle move spec item up', () => {
    const specItem1 = createSpecItem();
    const specItem2 = createSpecItem();
    const specItem3 = createSpecItem();
    const obj = {
      ...createSpec(),
      items: [specItem1, specItem2, specItem3],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER,
      payload: {
        specItemId: specItem2.id,
        moveDirection: MoveDirection.UP,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [specItem2, specItem1, specItem3],
    });
  });

  it('should handle move spec item down', () => {
    const specItem1 = createSpecItem();
    const specItem2 = createSpecItem();
    const specItem3 = createSpecItem();
    const obj = {
      ...createSpec(),
      items: [specItem1, specItem2, specItem3],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER,
      payload: {
        specItemId: specItem2.id,
        moveDirection: MoveDirection.DOWN,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [specItem1, specItem3, specItem2],
    });
  });

  it('should handle move spec item up out of bounds', () => {
    const specItem1 = createSpecItem();
    const specItem2 = createSpecItem();
    const specItem3 = createSpecItem();
    const obj = {
      ...createSpec(),
      items: [specItem1, specItem2, specItem3],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER,
      payload: {
        specItemId: specItem1.id,
        moveDirection: MoveDirection.UP,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [specItem1, specItem2, specItem3],
    });
  });

  it('should handle move spec item down out of bounds', () => {
    const specItem1 = createSpecItem();
    const specItem2 = createSpecItem();
    const specItem3 = createSpecItem();
    const obj = {
      ...createSpec(),
      items: [specItem1, specItem2, specItem3],
    };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER,
      payload: {
        specItemId: specItem3.id,
        moveDirection: MoveDirection.DOWN,
      },
    });

    expect(actual).toEqual({
      ...obj,
      items: [specItem1, specItem2, specItem3],
    });
  });

  it('should handle delete spec item', () => {
    const newSpecItem1 = createSpecItem();
    const newSpecItem2 = createSpecItem();
    const newSpec1 = { ...createSpec(), items: [newSpecItem1, newSpecItem2] };

    const actual = specReactReducer(newSpec1, {
      type: SpecReducerActionType.DELETE_SPEC_ITEM,
      payload: newSpecItem1.id,
    });

    expect(actual).toEqual({
      ...newSpec1,
      items: [newSpecItem2],
    });
  });

  it('should handle delete last spec item', () => {
    const newSpecItem1 = createSpecItem();
    const newSpec1 = { ...createSpec(), items: [newSpecItem1] };

    const actual = specReactReducer(newSpec1, {
      type: SpecReducerActionType.DELETE_SPEC_ITEM,
      payload: newSpecItem1.id,
    });

    expect(actual).toEqual({
      ...newSpec1,
      items: [newSpecItem1],
    });
  });
});
