import React, { useContext } from 'react';
import { Button, Col, FormControl, FormSelect } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { useAppDispatch } from '../../../app/hooks';
import { RESOURCE_EDITOR_PATH } from '../../../core/common/consts';
import { saveFn } from '../../../core/reducers/fn-reducers';
import {
  createPythonFnParameter,
  Fn,
  isPythonFn,
} from '../../../data/model/fn/fn';
import { FnType } from '../../../data/model/fn/fn-types';
import { ResourceType } from '../../../data/model/resource-types';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { PanelComponent } from '../../other-components/PanelComponent';
import { ActionValueComponent } from '../action/ActionValueComponent';
import { FnEditingContext, FnReducerActionType } from './fn-editing-context';
import { FnParameterComponent } from './FnParameterComponent';

export const FnComponent: React.FC<{ fn: Fn }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(FnEditingContext);
  const container = useContext(InjectionContext);
  const isSaved = useSaved(ResourceType.Enum.FN, props.fn.id);
  //
  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.FN_NAME);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
    validationContext.touch(Field.FN_ROLE_KEY);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_TYPE,
      payload: event.target.value as FnType.Type,
    });
  };
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: FnReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: FnReducerActionType.TOGGLE_LOCKED,
    });
  };
  const importPathChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_IMPORT_PATH,
      payload: event.target.value,
    });
    validationContext.touch(Field.FN_IMPORT_PATH);
  };
  const addFnParamHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    editingContext.localDispatch({
      type: FnReducerActionType.ADD_PARAMETER,
      payload: createPythonFnParameter(),
    });
    validationContext.touch(Field.FN_ADD_NEW_PARAMETER);
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      reduxDispatch(saveFn(props.fn));
      navigate(RESOURCE_EDITOR_PATH);
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <PanelComponent header="Create/Edit Function">
      <ExportImportOptionsComponent
        element={props.fn}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent
        labelText="Name"
        descriptionText="name of function"
        errorMessage={errorResults([Field.FN_NAME])}
      >
        <FormControl
          aria-label={Field[Field.FN_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_NAME)}
          isInvalid={!!errorResults([Field.FN_NAME])}
          value={props.fn.name}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of function"
        errorMessage={errorResults([Field.FN_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[Field.FN_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_ROLE_KEY)}
          isInvalid={!!errorResults([Field.FN_ROLE_KEY])}
          value={props.fn.roleKey}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Type"
        descriptionText="kind of function"
      >
        <FormSelect
          aria-label={Field[Field.FN_TYPE]}
          role="list"
          onChange={typeChangedHandler}
          value={props.fn.type}
        >
          {FnType.values().map((ft) => (
            <option key={ft} value={ft} role="listitem">
              {ft}
            </option>
          ))}
        </FormSelect>
      </FormGroupRowComponent>
      {isPythonFn(props.fn) && (
        <>
          <FormGroupRowComponent
            labelText="Import Path"
            descriptionText="import path of function"
            errorMessage={errorResults([Field.FN_IMPORT_PATH])}
          >
            <FormControl
              aria-label={Field[Field.FN_IMPORT_PATH]}
              type="text"
              onChange={importPathChangedHandler}
              onBlur={() => validationContext.touch(Field.FN_IMPORT_PATH)}
              isInvalid={!!errorResults([Field.FN_IMPORT_PATH])}
              value={props.fn.importTokens.join('.')}
            />
          </FormGroupRowComponent>
          <FormGroupRowComponent
            labelText="Parameters"
            descriptionText="parameters of function"
          >
            <Col sm="12" className="mb-2">
              <Button
                aria-label={Field[Field.FN_ADD_NEW_PARAMETER]}
                variant="outline-primary"
                onClick={addFnParamHandler}
                size="lg"
              >
                Add New Parameter
              </Button>
            </Col>

            {props.fn.parameters.map((param) => (
              <FnParameterComponent param={param} key={param.id} />
            ))}
          </FormGroupRowComponent>
        </>
      )}

      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
          aria-label={Field[Field.FN_DELETE]}
        >
          Delete
        </Button>
      )}
      <Button
        onClick={(_e) => navigate(RESOURCE_EDITOR_PATH)}
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
