import React, { useContext } from 'react';
import { Button, Col, FormControl } from 'react-bootstrap';
import { saveSpec } from './spec-reducers';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { SpecItemComponent } from './SpecItemComponent';
import { saveSelector } from '../selector/selector-reducers';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { SpecPreviewComponent } from './SpecPreviewComponent';
import { Field } from '../../../validation/validation-field';
import { SpecItemType } from './spec-item-type';
import { createSpecItem, Spec } from './data/spec-domain';
import { ValidationContext } from '../../../validation/validation-context';
import {
  SpecEditingContext,
  SpecReducerActionType,
} from './spec-editing-context';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { InjectionContext } from '../../../di/injector-context';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../ui/ErrorTextComponent';
import { useSaved } from '../../../data/use-saved';
import { ElementType } from '../common/element-types';

const SP_ROLE_KEY = Field.SP_ROLE_KEY;

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(SpecEditingContext);
  const injectionContext = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.SPEC, props.spec.id);
  const specDefaultNamer = injectionContext.default.namers.spec;

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
  const saveSpecHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      // TODO: this still creates orphans... damnit... clear them
      // at least it's less this way
      props.spec.items.forEach((item) => {
        switch (item.itemType) {
          case SpecItemType.Enum.SELECTOR:
            const sel = injectionContext.mappers.selector.mapFromDomain(
              item.selector
            );
            return reduxDispatch(saveSelector(sel));
        }
      });
      const specRedux = injectionContext.mappers.spec.mapFromDomain(props.spec);
      reduxDispatch(saveSpec(specRedux));
      reduxDispatch(setEditorFocus());
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const noSpecItemsErrorMessage = errorResults([Field.SP_ADD_ITEM_BUTTON]);
  const nameError = errorResults([Field.SP_NAME]);

  return (
    <PanelComponent header="Create/Edit Spec">
      <FormGroupRowComponent
        labelText="Name"
        descriptionText="name of spec"
        errorMessage={nameError}
      >
        <FormControl
          aria-label={Field[Field.SP_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.SP_NAME)}
          isInvalid={!!nameError}
          value={props.spec.name}
          placeholder={specDefaultNamer.getDefaultName(props.spec)}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of spec"
        errorMessage={errorResults([SP_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[SP_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(SP_ROLE_KEY)}
          isInvalid={!!errorResults([SP_ROLE_KEY])}
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
            aria-label={Field[Field.SP_ADD_ITEM_BUTTON]}
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
        errorMessage={errorResults([Field.SP_SAVE])}
        row={true}
      />
      <Col sm="12" className="mb-1">
        {isSaved && (
          <Button
            onClick={() => editingContext.deleteModalConfig.setShow(true)}
            variant="danger"
            size="lg"
            className="me-3"
          >
            Delete
          </Button>
        )}
        <Button
          onClick={(_e) => reduxDispatch(setEditorFocus())}
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
