import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createPreferences,
  Preferences,
} from '../../data/preferences/preferences';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import {
  PreferencesReducerAction,
  PreferencesReducerActionType,
  PreferencesReducerStringAction,
} from '../../ui/other-components/menu/preferences/preferences-editing-context';

export type PreferencesState = {
  readonly preferences: Preferences;
};

const initialState: PreferencesState = {
  preferences: createPreferences(),
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    savePreferences: (state, action: PayloadAction<Preferences>) => {
      state.preferences = action.payload;
    },
  },
});

export const { savePreferences } = preferencesSlice.actions;
export const preferencesReduxReducer = preferencesSlice.reducer;

const changeNegativizer = (
  state: Preferences,
  action: PreferencesReducerStringAction
): Preferences => {
  return {
    ...state,
    negativizer: {
      ...state.negativizer,
      selector: action.payload,
    },
  };
};

export const preferencesReactReducer = (
  state: Preferences,
  action: PreferencesReducerAction
): Preferences => {
  const actionType = action.type;
  switch (actionType) {
    case PreferencesReducerActionType.CHANGE_NEGATIVIZER:
      return changeNegativizer(state, action);
    default:
      throw new ExhaustivenessFailureError(actionType);
  }
};
