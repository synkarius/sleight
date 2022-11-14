import {
  createPreferences,
  Preferences,
} from '../../data/preferences/preferences';
import { PreferencesReducerActionType } from '../../ui/other-components/menu/preferences/preferences-editing-context';
import {
  preferencesReactReducer,
  preferencesReduxReducer,
  PreferencesState,
  savePreferences,
} from './preferences-reducers';

describe('preferences reducer', () => {
  it('should handle initial state', () => {
    expect(preferencesReduxReducer(undefined, { type: 'unknown' })).toEqual({
      preferences: createPreferences(),
    });
  });

  it('should handle save', () => {
    const obj: Preferences = {
      negativizer: {
        selector: 'asdf',
      },
    };

    const prereducerState: PreferencesState = {
      preferences: {
        negativizer: {
          selector: 'init',
        },
      },
    };

    const actual = preferencesReduxReducer(
      prereducerState,
      savePreferences(obj)
    );

    expect(actual.preferences).toEqual(obj);
  });

  it('should handle change negativizer', () => {
    const obj: Preferences = {
      negativizer: {
        selector: 'init',
      },
    };
    const actual = preferencesReactReducer(obj, {
      type: PreferencesReducerActionType.CHANGE_NEGATIVIZER,
      payload: 'asdf',
    });

    expect(actual).toEqual<Preferences>({
      ...obj,
      negativizer: { ...obj.negativizer, selector: 'asdf' },
    });
  });
});
