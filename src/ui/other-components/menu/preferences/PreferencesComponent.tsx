import React, { useContext, useReducer } from 'react';
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { WIZARD_PATH } from '../../../../core/common/consts';
import {
  preferencesReactReducer,
  savePreferences,
} from '../../../../core/reducers/preferences-reducers';
import { DEFAULT_NEGATIVIZER_SELECTOR } from '../../../../data/preferences/negativizer';
import { Preferences } from '../../../../data/preferences/preferences';
import { InjectionContext } from '../../../../di/injector-context';
import { FieldValidator } from '../../../../validation/field-validator';
import { ValidationContext } from '../../../../validation/validation-context';
import { Field } from '../../../../validation/validation-field';
import { processErrorResults } from '../../../../validation/validation-result-processing';
import { ValidationComponent } from '../../../../validation/ValidationComponent';
import { FormGroupRowComponent } from '../../FormGroupRowComponent';
import { PanelComponent } from '../../PanelComponent';
import {
  PreferencesEditingContext,
  PreferencesReducerActionType,
} from './preferences-editing-context';

export const PreferencesComponent: React.FC<{}> = () => {
  const savedPreferences = useAppSelector(
    (state) => state.preferences.preferences
  );
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    preferencesReactReducer,
    savedPreferences
  );

  // TODO: preferences validators (negativizer not blank, negativizer alphaspace only)
  const validators: FieldValidator<Preferences>[] = [];

  return (
    <ValidationComponent<Preferences> validators={validators} editing={editing}>
      <PreferencesEditingContext.Provider value={{ localDispatch }}>
        <PreferencesChildComponent preferences={editing} />
      </PreferencesEditingContext.Provider>
    </ValidationComponent>
  );
};

const PreferencesChildComponent: React.FC<{
  preferences: Preferences;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(PreferencesEditingContext);
  const container = useContext(InjectionContext);
  const navigate = useNavigate();
  const { preferences } = props;

  const negativizerChangedHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: PreferencesReducerActionType.CHANGE_NEGATIVIZER,
      payload: e.target.value,
    });
    validationContext.touch(Field.PREFS_NEGATIVIZER);
  };

  const submitHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    const formIsValid = validationContext.validateForSave();
    if (formIsValid) {
      reduxDispatch(savePreferences(preferences));
      navigate(WIZARD_PATH);
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const negativizerError = errorResults(Field.PREFS_NEGATIVIZER);

  return (
    <PanelComponent header="Edit Preferences">
      <FormGroupRowComponent
        labelText="Negativizer"
        errorMessage={negativizerError}
      >
        <FormControl
          aria-label={Field[Field.PREFS_NEGATIVIZER]}
          type="text"
          onChange={negativizerChangedHandler}
          onBlur={() => validationContext.touch(Field.PREFS_NEGATIVIZER)}
          isInvalid={!!negativizerError}
          value={preferences.negativizer.selector}
          placeholder={DEFAULT_NEGATIVIZER_SELECTOR}
        />
        <FormText className="text-muted">
          special selector to make negative-range-inclusive variables negative
        </FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Theme">
        <FormSelect
          aria-label={Field[Field.PREFS_THEME]}
          role="list"
          value={'default'}
        >
          <option value={'default'} role="listitem">
            Default Theme
          </option>
        </FormSelect>
        <FormText className="text-muted">alternate Bootstrap themes</FormText>
      </FormGroupRowComponent>
      <Button
        onClick={() => navigate(WIZARD_PATH)}
        className="me-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};
