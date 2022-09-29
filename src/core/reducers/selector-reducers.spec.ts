import {
  createSelector,
  createSelectorItem,
  Selector,
  SelectorItem,
} from '../../data/model/selector/selector-domain';
import {
  SelectorsState,
  saveSelector,
  deleteSelector,
  createNewSelectorItem,
  editSelectorItem,
  deleteSelectorItem,
  selectorReduxReducer,
} from './selector-reducers';

describe('selector reducer', () => {
  const initialState: SelectorsState = {
    saved: {},
  };
  it('should handle initial state', () => {
    expect(selectorReduxReducer(undefined, { type: 'unknown' })).toEqual({
      saved: {},
    });
  });

  it('should handle create new', () => {
    const newObject = createSelector();

    const actual = selectorReduxReducer(initialState, saveSelector(newObject));

    const expected: Record<string, Selector> = {};
    expected[newObject.id] = {
      id: newObject.id,
      items: [
        {
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
    const expected: Record<string, Selector> = {};

    expect(actual.saved).toEqual(expected);
  });

  it('should handle create new selector item', () => {
    const newSelector1 = createSelector();
    const newSelector2 = createSelector();
    const newSelectorItem1: SelectorItem = {
      ...createSelectorItem(),
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

    const expected: Record<string, Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      items: [
        {
          id: expect.any(String),
          value: '',
        },
        {
          id: expect.any(String),
          value: 'some-value',
        },
      ],
    };
    expected[newSelector2.id] = {
      id: newSelector2.id,
      items: [
        {
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

    const expected: Record<string, Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      items: [
        {
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

    const expected: Record<string, Selector> = {};
    expected[newSelector1.id] = {
      id: newSelector1.id,
      items: [],
    };

    expect(actual.saved).toEqual(expected);
  });
});
