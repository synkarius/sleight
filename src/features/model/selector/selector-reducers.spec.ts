import { ReduxFriendlyStringMap } from '../../../util/string-map';
import {
  createSelector,
  createSelectorItem,
  Selector,
  SelectorItem,
} from './data/selector-domain';
import {
  SelectorsState,
  saveSelector,
  deleteSelector,
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
  selectorReduxReducer,
} from './selector-reducers';

describe('role key reducer', () => {
  const initialState: SelectorsState = {
    saved: {},
    editingId: undefined,
  };
  it('should handle initial state', () => {
    expect(selectorReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
      editingId: undefined,
    });
  });

  it('should handle create new', () => {
    const newObject = createSelector();

    const actual = selectorReduxReducer(initialState, saveSelector(newObject));

    const expected: ReduxFriendlyStringMap<Selector> = {};
    expected[newObject.id] = {
      id: newObject.id,
      roleKeyId: null,
      items: [
        {
          roleKeyId: null,
          id: expect.any(String),
          value: '',
        },
      ],
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete', () => {
    const newObject = createSelector();

    const createdState = selectorReduxReducer(
      initialState,
      saveSelector(newObject)
    );
    const actual = selectorReduxReducer(
      createdState,
      deleteSelector(newObject.id)
    );
    const expected: ReduxFriendlyStringMap<Selector> = {};

    expect(actual.saved).toEqual(expected);
  });

  it('should handle create new selector item', () => {
    const newSelector1 = createSelector();
    const newSelector2 = createSelector();
    const newSelectorItem1: SelectorItem = {
      ...createSelectorItem(),
      roleKeyId: 'some-rk-id',
      value: 'some-value',
    };

    const createdState1 = selectorReduxReducer(
      initialState,
      saveSelector(newSelector1)
    );
    const createdState2 = selectorReduxReducer(
      createdState1,
      saveSelector(newSelector2)
    );
    const actual = selectorReduxReducer(
      createdState2,
      createNewSelectorItem({
        selectorId: newSelector1.id,
        selectorItem: newSelectorItem1,
      })
    );

    const expected: ReduxFriendlyStringMap<Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      roleKeyId: null,
      items: [
        {
          roleKeyId: null,
          id: expect.any(String),
          value: '',
        },
        {
          roleKeyId: 'some-rk-id',
          id: expect.any(String),
          value: 'some-value',
        },
      ],
    };
    expected[newSelector2.id] = {
      id: newSelector2.id,
      roleKeyId: null,
      items: [
        {
          roleKeyId: null,
          id: expect.any(String),
          value: '',
        },
      ],
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle edit selector item', () => {
    const newSelector1 = createSelector();

    const createdState1 = selectorReduxReducer(
      initialState,
      saveSelector({
        ...newSelector1,
        items: [
          {
            ...newSelector1.items[0],
            roleKeyId: 'some-id',
            value: 'some-value',
          },
        ],
      })
    );
    const actual = selectorReduxReducer(
      createdState1,
      editSelectorItem({
        selectorId: newSelector1.id,
        selectorItemId: newSelector1.items[0].id,
        value: 'zxcv',
      })
    );

    const expected: ReduxFriendlyStringMap<Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      roleKeyId: null,
      items: [
        {
          roleKeyId: 'some-id',
          id: newSelector1.items[0].id,
          value: 'zxcv',
        },
      ],
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete selector item', () => {
    const newSelector1 = createSelector();

    const createdState1 = selectorReduxReducer(
      initialState,
      saveSelector(newSelector1)
    );
    const actual = selectorReduxReducer(
      createdState1,
      deleteSelectorItem({
        selectorId: newSelector1.id,
        selectorItemId: newSelector1.items[0].id,
      })
    );

    const expected: ReduxFriendlyStringMap<Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      roleKeyId: null,
      items: [],
    };

    expect(actual.saved).toEqual(expected);
  });
});
