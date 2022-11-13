import React, { useContext, useReducer, useState } from 'react';
import { Button, Col, FormControl, FormSelect } from 'react-bootstrap';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { saveFn } from '../../../core/reducers/fn-reducers';
import {
  createPythonFnParameter,
  Fn,
  isPythonFn,
  createPythonFn,
} from '../../../data/model/fn/fn';
import { FnType } from '../../../data/model/fn/fn-types';
import { ResourceType } from '../../../data/model/resource-types';
import { ValidationContext } from '../../../validation/validation-context';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { PanelComponent } from '../../other-components/PanelComponent';
import { VerticalMoveableComponent } from '../../other-components/VerticalMoveableComponent';
import { FnEditingContext, FnReducerActionType } from './fn-editing-context';
import { FnParameterComponent } from './FnParameterComponent';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RESOURCE_EDITOR_PATH } from '../../../core/common/consts';
import { deleteFn, fnReactReducer } from '../../../core/reducers/fn-reducers';
import { Tokens } from '../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../di/injector-context';
import { Field } from '../../../validation/validation-field';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { MapUtil } from '../../../core/common/map-util';
import { DomainMapper } from '../../../core/mappers/mapper';
import { fieldName } from '../../../validation/field-name';

const init = (
  savedMap: Record<string, Fn>,
  mapper: DomainMapper<Fn, Fn>
): ((f?: string) => Fn) => {
  return (fnId?: string) => {
    if (fnId && savedMap[fnId]) {
      return mapper.mapToDomain({ ...MapUtil.getOrThrow(savedMap, fnId) });
    }
    return createPythonFn();
  };
};

export const FnComponent: React.FC<{ fnId?: string }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedMap = useAppSelector((state) => state.fn.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    fnReactReducer,
    props.fnId,
    init(savedMap, container.get(Tokens.DomainMapper_Fn))
  );
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteFn(editing.id));
    navigate(RESOURCE_EDITOR_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Fn);
  return (
    <ValidationComponent<Fn> validators={validators} editing={editing}>
      <FnEditingContext.Provider value={{ localDispatch, deleteModalConfig }}>
        <FnChildComponent fn={editing} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.FN_DELETE_MODAL_DELETE}
          cancelField={Field.FN_DELETE_MODAL_CANCEL}
        />
      </FnEditingContext.Provider>
    </ValidationComponent>
  );
};

const FnChildComponent: React.FC<{ fn: Fn }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(FnEditingContext);
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
        errorMessage={errorResults(Field.FN_NAME)}
      >
        <FormControl
          aria-label={fieldName(Field.FN_NAME)}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_NAME)}
          isInvalid={!!errorResults(Field.FN_NAME)}
          value={props.fn.name}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of function"
        errorMessage={errorResults(Field.FN_ROLE_KEY)}
      >
        <FormControl
          aria-label={fieldName(Field.FN_ROLE_KEY)}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_ROLE_KEY)}
          isInvalid={!!errorResults(Field.FN_ROLE_KEY)}
          value={props.fn.roleKey}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Type"
        descriptionText="kind of function"
        errorMessage={errorResults(Field.FN_TYPE)}
      >
        <FormSelect
          aria-label={fieldName(Field.FN_TYPE)}
          role="list"
          onChange={typeChangedHandler}
          value={props.fn.type}
          isInvalid={!!errorResults(Field.FN_TYPE)}
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
            errorMessage={errorResults(Field.FN_IMPORT_PATH)}
          >
            <FormControl
              aria-label={fieldName(Field.FN_IMPORT_PATH)}
              type="text"
              onChange={importPathChangedHandler}
              onBlur={() => validationContext.touch(Field.FN_IMPORT_PATH)}
              isInvalid={!!errorResults(Field.FN_IMPORT_PATH)}
              value={props.fn.importTokens.join('.')}
            />
          </FormGroupRowComponent>
          <FormGroupRowComponent labelText="Parameters">
            <Col sm="12" className="mb-2">
              <Button
                aria-label={fieldName(Field.FN_ADD_NEW_PARAMETER)}
                variant="outline-primary"
                onClick={addFnParamHandler}
                size="lg"
              >
                Add New Parameter
              </Button>
            </Col>

            {props.fn.parameters.map((param, index) => (
              <VerticalMoveableComponent
                deleteField={Field.FN_DELETE_PARAMETER}
                moveFn={(direction) => {
                  editingContext.localDispatch({
                    type: FnReducerActionType.MOVE_PARAMETER,
                    payload: { index: index, direction: direction },
                  });
                  validationContext.touch(Field.FN_DELETE_PARAMETER);
                }}
                deleteFn={() => {
                  editingContext.localDispatch({
                    type: FnReducerActionType.DELETE_PARAMETER,
                    payload: index,
                  });
                  validationContext.touch(Field.FN_DELETE_PARAMETER);
                }}
                key={param.id + '-' + index}
              >
                <FnParameterComponent param={param} />
              </VerticalMoveableComponent>
            ))}
            <ErrorTextComponent
              errorMessage={errorResults([
                Field.FN_ADD_NEW_PARAMETER,
                Field.FN_DELETE_PARAMETER,
              ])}
            />
          </FormGroupRowComponent>
        </>
      )}

      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
          aria-label={fieldName(Field.FN_DELETE)}
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
