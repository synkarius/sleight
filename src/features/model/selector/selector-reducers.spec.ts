import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { createSelector, createSelectorItem, Selector } from './selector';
import {
  SelectorsState,
  createNewSelector,
  deleteSelector,
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
  selectorReducer,
} from './selector-reducers';

describe('role key reducer', () => {
  const initialState: SelectorsState = {
    saved: {},
  };
  it('should handle initial state', () => {
    expect(selectorReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
    });
  });

  it('should handle create new', () => {
    const newObject = createSelector();

    const actual = selectorReducer(initialState, createNewSelector(newObject));

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

    const createdState = selectorReducer(
      initialState,
      createNewSelector(newObject)
    );
    const actual = selectorReducer(createdState, deleteSelector(newObject.id));
    const expected: ReduxFriendlyStringMap<Selector> = {};

    expect(actual.saved).toEqual(expected);
  });

  it('should handle create new selector item', () => {
    const newSelector1 = createSelector();
    const newSelector2 = createSelector();
    const newSelectorItem1 = createSelectorItem();
    newSelectorItem1.roleKeyId = 'some-rk-id';
    newSelectorItem1.value = 'some-value';

    const createdState1 = selectorReducer(
      initialState,
      createNewSelector(newSelector1)
    );
    const createdState2 = selectorReducer(
      createdState1,
      createNewSelector(newSelector2)
    );
    const actual = selectorReducer(
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
    const newSelectorItem1 = newSelector1.items[0];
    newSelectorItem1.roleKeyId = 'some-id';
    newSelectorItem1.value = 'some-value';

    const createdState1 = selectorReducer(
      initialState,
      createNewSelector(newSelector1)
    );
    const actual = selectorReducer(
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
          id: newSelectorItem1.id,
          value: 'zxcv',
        },
      ],
    };

    expect(actual.saved).toEqual(expected);
  });

  it('should handle delete selector item', () => {
    const newSelector1 = createSelector();

    const createdState1 = selectorReducer(
      initialState,
      createNewSelector(newSelector1)
    );
    const actual = selectorReducer(
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
