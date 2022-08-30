import React, { useContext } from 'react';
import { Button, Col, FormControl } from 'react-bootstrap';
import { saveEditingSpec } from './spec-reducers';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { SpecItemComponent } from './SpecItemComponent';
import { saveSelector } from '../selector/selector-reducers';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
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

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(SpecEditingContext);
  const injectionContext = useContext(InjectionContext);
  const specDefaultNamer = injectionContext.default.namers.spec;

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.SP_NAME);
  };

  const addSpecItemHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.ADD_SPEC_ITEM,
      payload: createSpecItem(),
    });
    validationContext.touch(Field.SP_ADD_ITEM_BUTTON);
  };
  const saveSpecHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForm();
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
      reduxDispatch(saveEditingSpec(specRedux));
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
        descriptionText="role of variable"
      >
        <RoleKeyDropdownComponent
          field={Field.SP_ROLE_KEY}
          roleKeyId={props.spec.roleKeyId}
          onChange={(e) =>
            editingContext.localDispatchFn({
              type: SpecReducerActionType.CHANGE_ROLE_KEY,
              payload: e.target.value,
            })
          }
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
        <Button
          variant="primary"
          size="lg"
          onClick={saveSpecHandler}
          disabled={fullErrorResults.length > 0}
        >
          Save
        </Button>
        <Button
          onClick={(_e) => reduxDispatch(setEditorFocus())}
          className="mx-3"
          variant="warning"
          size="lg"
        >
          Cancel
        </Button>
      </Col>
    </PanelComponent>
  );
};
