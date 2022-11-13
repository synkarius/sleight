import React, { useContext, useReducer, useState } from 'react';
import { Button, Col, FormControl } from 'react-bootstrap';
import { saveSpec } from '../../../core/reducers/spec-reducers';
import { PanelComponent } from '../../other-components/PanelComponent';
import { SpecItemComponent } from './SpecItemComponent';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { SpecPreviewComponent } from './SpecPreviewComponent';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import {
  createSpec,
  createSpecItem,
  Spec,
} from '../../../data/model/spec/spec-domain';
import { ValidationContext } from '../../../validation/validation-context';
import {
  SpecEditingContext,
  SpecReducerActionType,
} from './spec-editing-context';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { ElementType } from '../../../data/model/element-types';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { SpecDTO } from '../../../data/model/spec/spec-dto';
import {
  deleteSpec,
  specReactReducer,
} from '../../../core/reducers/spec-reducers';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { InjectionContext } from '../../../di/injector-context';
import { SpecDomainMapper } from '../../../core/mappers/spec-domain-mapper';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { doNothing } from '../../../core/common/common-functions';
import { MapUtil } from '../../../core/common/map-util';
import { fieldName } from '../../../validation/field-name';

const SP_ROLE_KEY = Field.SP_ROLE_KEY;

type SpecInitFunction = (specId?: string) => Spec;

const getSpecInitFunction = (
  savedSpecMap: Record<string, SpecDTO>,
  savedSelectorMap: Record<string, SelectorDTO>,
  specDomainMapper: SpecDomainMapper
): SpecInitFunction => {
  return (specId?: string) => {
    if (specId && savedSpecMap[specId]) {
      return specDomainMapper.mapToDomain(
        { ...MapUtil.getOrThrow(savedSpecMap, specId) },
        savedSelectorMap
      );
    }
    return createSpec();
  };
};

export const SpecComponent: React.FC<{
  specId?: string;
  closeFn?: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const specs = useAppSelector((state) => state.spec.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    specReactReducer,
    props.specId,
    getSpecInitFunction(
      specs,
      selectors,
      container.get(Tokens.DomainMapper_Spec)
    )
  );
  const [show, setShow] = useState(false);

  const closeFn = props.closeFn ?? doNothing;
  const handleDelete = () => {
    reduxDispatch(deleteSpec(editing.id));
    closeFn();
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Spec);

  return (
    <ValidationComponent<Spec> validators={validators} editing={editing}>
      <SpecEditingContext.Provider value={{ localDispatch, deleteModalConfig }}>
        <SpecChildComponent spec={editing} closeFn={closeFn} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.SP_DELETE_MODAL_DELETE}
          cancelField={Field.SP_DELETE_MODAL_CANCEL}
        />
      </SpecEditingContext.Provider>
    </ValidationComponent>
  );
};

const SpecChildComponent: React.FC<{
  spec: Spec;
  closeFn: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(SpecEditingContext);
  const container = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.SPEC, props.spec.id);
  const specDefaultNamer = container.get(Tokens.DefaultNamer_Spec);
  const selectorMapper = container.get(Tokens.DomainMapper_Selector);
  const specMapper = container.get(Tokens.DomainMapper_Spec);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: SpecReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.SP_NAME);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: SpecReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
    validationContext.touch(SP_ROLE_KEY);
  };
  const addSpecItemHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    editingContext.localDispatch({
      type: SpecReducerActionType.ADD_SPEC_ITEM,
      payload: createSpecItem(),
    });
    validationContext.touch(Field.SP_ADD_ITEM_BUTTON);
  };
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: SpecReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: SpecReducerActionType.TOGGLE_LOCKED,
    });
  };
  const saveSpecHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      // TODO: this still creates orphans... damnit... clear them
      // at least it's less this way
      props.spec.items.forEach((item) => {
        switch (item.itemType) {
          case SpecItemType.Enum.SELECTOR:
            const sel = selectorMapper.mapFromDomain(item.selector);
            return reduxDispatch(saveSelector(sel));
        }
      });
      const specRedux = specMapper.mapFromDomain(props.spec);
      reduxDispatch(saveSpec(specRedux));
      props.closeFn();
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const noSpecItemsErrorMessage = errorResults(Field.SP_ADD_ITEM_BUTTON);
  const nameError = errorResults(Field.SP_NAME);

  return (
    <PanelComponent header="Create/Edit Spec">
      <ExportImportOptionsComponent
        element={props.spec}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent
        labelText="Name"
        descriptionText="name of spec"
        errorMessage={nameError}
      >
        <FormControl
          aria-label={fieldName(Field.SP_NAME)}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.SP_NAME)}
          isInvalid={!!nameError}
          value={props.spec.name}
          placeholder={specDefaultNamer.getName(props.spec)}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of spec"
        errorMessage={errorResults(SP_ROLE_KEY)}
      >
        <FormControl
          aria-label={fieldName(SP_ROLE_KEY)}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(SP_ROLE_KEY)}
          isInvalid={!!errorResults(SP_ROLE_KEY)}
          value={props.spec.roleKey}
        />
      </FormGroupRowComponent>
      <SpecPreviewComponent spec={props.spec} />
      <div>
        {props.spec.items.map((specItem, index) => (
          <SpecItemComponent
            key={specItem.id}
            specItem={specItem}
            required={index === 0}
          />
        ))}
      </div>
      <div>
        <Col sm="12" className="mb-2">
          <Button
            aria-label={fieldName(Field.SP_ADD_ITEM_BUTTON)}
            variant={
              !noSpecItemsErrorMessage ? 'outline-primary' : 'outline-danger'
            }
            onClick={addSpecItemHandler}
            size="lg"
          >
            Add New Spec Item
          </Button>
        </Col>
        <Col sm="12" className="mb-3">
          <ErrorTextComponent errorMessage={noSpecItemsErrorMessage} />
        </Col>
      </div>
      <ErrorTextComponent
        errorMessage={errorResults(Field.SP_SAVE)}
        row={true}
      />
      <Col sm="12" className="mb-1">
        {isSaved && (
          <Button
            onClick={() => editingContext.deleteModalConfig.setShow(true)}
            variant="danger"
            size="lg"
            className="me-3"
            aria-label={fieldName(Field.SP_DELETE)}
          >
            Delete
          </Button>
        )}
        <Button
          onClick={props.closeFn}
          className="me-3"
          variant="warning"
          size="lg"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={saveSpecHandler}
          disabled={fullErrorResults.length > 0}
        >
          Save
        </Button>
      </Col>
    </PanelComponent>
  );
};
