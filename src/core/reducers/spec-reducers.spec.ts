import { MoveDirection } from '../common/move-direction';
import { createSpec, createSpecItem } from '../../data/model/spec/spec-domain';
import { SpecDTO } from '../../data/model/spec/spec-dto';
import { SpecReducerActionType } from '../../ui/model/spec/spec-editing-context';
import { SpecItemType } from '../../data/model/spec/spec-item-type';
import {
  SpecsState,
  saveSpec,
  specReduxReducer,
  specReactReducer,
  deleteSpec,
  setSpecs,
} from './spec-reducers';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

const createTestSpecRedux = (from?: {
  id?: string;
  name?: string;
  specItemId?: string;
  selectorId?: string;
}): SpecDTO => {
  return {
    id: from?.id ?? 'asdf-id',
    name: from?.name ?? '',
    roleKey: '',
    enabled: true,
    locked: false,
    items: [
      {
        id: from?.specItemId ?? 'asdf-id',
        itemId: from?.selectorId ?? 'asdf-spec-item-id',
        itemType: SpecItemType.Enum.SELECTOR,
        optional: false,
        grouped: false,
      },
    ],
  };
};

describe('spec reducer', () => {
  const specMapper = container.get(Tokens.DomainMapper_Spec);
  const specDefaultNamer = container.get(Tokens.DefaultNamer_Spec);

  it('should handle initial state', () => {
    expect(specReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
    });
  });

  it('should handle save', () => {
    const obj = createTestSpecRedux({
      id: 'some-id',
      name: '',
      specItemId: 'some-spec-item-id',
      selectorId: 'some-selector-id',
    });

    const prereducerState: SpecsState = {
      saved: {},
    };
    const actual = specReduxReducer(prereducerState, saveSpec(obj));

    const expected: Record<string, SpecDTO> = {};
    expected[obj.id] = createTestSpecRedux({
      id: obj.id,
      name: specDefaultNamer.getDefaultName(obj),
      specItemId: obj.items[0].id,
      selectorId: obj.items[0].itemId,
    });

    expect(actual.saved).toEqual(expected);
  });

  it('should handle save with name', () => {
    const obj = createTestSpecRedux({
      id: 'some-id',
      name: 'asdf',
      specItemId: 'some-spec-item-id',
      selectorId: 'some-selector-id',
    });

    const prereducerState: SpecsState = {
      saved: {},
    };
    const actual = specReduxReducer(prereducerState, saveSpec(obj));

    const expected: Record<string, SpecDTO> = {};
    expected[obj.id] = createTestSpecRedux({
      id: obj.id,
      name: 'asdf',
      specItemId: obj.items[0].id,
      selectorId: obj.items[0].itemId,
    });

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete', () => {
    const obj = createSpec();
    const dto = specMapper.mapFromDomain(obj);

    const preReducerState: SpecsState = {
      saved: { [dto.id]: dto },
    };

    const actual = specReduxReducer(preReducerState, deleteSpec(obj.id));

    expect(actual.saved).toEqual({});
  });

  it('should handle change name', () => {
    const obj = { ...createSpec(), id: 'some-selector-id-1', name: '' };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_NAME,
      payload: 'asdf',
    });

    expect(actual).toEqual({
      ...obj,
      name: 'asdf',
    });
  });

  it('should handle change name to blank', () => {
    const obj = { ...createSpec(), id: 'some-selector-id-1', name: 'asdf' };

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.CHANGE_NAME,
      payload: '    ',
    });

    expect(actual).toEqual({
      ...obj,
      name: '',
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
      roleKey: 'asdf',
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
          optional: false,
          grouped: false,
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
          optional: false,
          grouped: false,
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
          optional: false,
          grouped: false,
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

  it('should handle toggle spec item "optional"', () => {
    const newSpecItem1 = createSpecItem();
    const newSpecItem2 = createSpecItem();
    const newSpec1 = { ...createSpec(), items: [newSpecItem1, newSpecItem2] };

    const actual = specReactReducer(newSpec1, {
      type: SpecReducerActionType.TOGGLE_SPEC_ITEM_OPTIONAL,
      payload: newSpecItem2.id,
    });

    expect(actual).toEqual({
      ...newSpec1,
      items: [newSpecItem1, { ...newSpecItem2, optional: true }],
    });
  });

  it('should handle toggle spec item "grouped"', () => {
    const newSpecItem1 = createSpecItem();
    const newSpecItem2 = createSpecItem();
    const newSpec1 = { ...createSpec(), items: [newSpecItem1, newSpecItem2] };

    const actual = specReactReducer(newSpec1, {
      type: SpecReducerActionType.TOGGLE_SPEC_ITEM_GROUPED,
      payload: newSpecItem2.id,
    });

    expect(actual).toEqual({
      ...newSpec1,
      items: [newSpecItem1, { ...newSpecItem2, grouped: true }],
    });
  });

  it('should handle toggle enabled', () => {
    const obj = createSpec();

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.TOGGLE_ENABLED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      enabled: !obj.enabled,
    });
  });

  it('should handle toggle locked', () => {
    const obj = createSpec();

    const actual = specReactReducer(obj, {
      type: SpecReducerActionType.TOGGLE_LOCKED,
    });

    expect(actual).not.toBe(obj);
    expect(actual).toEqual({
      ...obj,
      locked: !obj.locked,
    });
  });

  it('should handle set', () => {
    const obj1 = createTestSpecRedux({ id: 'asdf-12304987' });
    const preReducerState: SpecsState = {
      saved: { [obj1.id]: obj1 },
    };

    const obj2 = createTestSpecRedux({ id: 'zxcv-394872' });
    const newReducerState: SpecsState = {
      saved: { [obj2.id]: obj2 },
    };

    const actual = specReduxReducer(
      preReducerState,
      setSpecs(newReducerState.saved)
    );

    expect(actual).toEqual(newReducerState);
  });
});
