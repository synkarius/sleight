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
import { selectorDomainMapper } from '../selector/data/selector-domain-mapper';
import { specDomainMapper } from './data/spec-domain-mapper';
import { setFocus } from '../../menu/focus/focus-reducers';

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(SpecEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
  };

  const addSpecItemHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.ADD_SPEC_ITEM,
      payload: createSpecItem(),
    });
  };
  const saveSpecHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForm();
    if (isValid) {
      // TODO: this still creates orphans... damnit... clear them
      // at least it's less this way
      props.spec.items.forEach((item) => {
        switch (item.itemType) {
          case SpecItemType.Enum.SELECTOR:
            const sel = selectorDomainMapper.mapFromDomain(item.selector);
            return reduxDispatch(saveSelector(sel));
        }
      });
      const specRedux = specDomainMapper.mapFromDomain(props.spec);
      reduxDispatch(saveEditingSpec(specRedux));
    }
  };
  const validationErrors = validationContext.getErrorResults();

  return (
    <PanelComponent header="Create/Edit Spec">
      <FormGroupRowComponent labelText="Name" descriptionText="name of spec">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.spec.name}
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
      <FormGroupRowComponent labelText="Spec Items">
        {props.spec.items.map((specItem, index) => (
          <SpecItemComponent
            key={specItem.id}
            specItem={specItem}
            required={index === 0}
          />
        ))}
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="">
        <Col sm="12" className="my-3">
          <Button
            variant="outline-primary"
            onClick={addSpecItemHandler}
            size="lg"
          >
            Add New Spec Item
          </Button>
        </Col>
      </FormGroupRowComponent>

      <Col sm="12" className="mb-1">
        <Button
          variant="primary"
          size="lg"
          onClick={saveSpecHandler}
          disabled={validationErrors.length > 0}
        >
          Save
        </Button>
        <Button
          onClick={(_e) => reduxDispatch(setFocus())}
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
