import React from 'react';
import { Button, Col, FormControl } from 'react-bootstrap';
import {
  addSpecItem,
  changeEditingSpecName,
  changeEditingSpecRoleKey,
  clearEditingSpec,
  saveEditingSpec,
} from './spec-reducers';
import { useAppDispatch } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { createSpecItem, Spec, SpecItemType } from './spec';
import { SpecItemComponent } from './SpecItemComponent';
import { createSelector } from '../selector/selector';
import { createNewSelector } from '../selector/selector-reducers';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { SpecPreviewComponent } from './SpecPreviewComponent';
import { Field } from '../../../validation/validation-field';

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  const dispatch = useAppDispatch();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingSpecName(event.target.value));
  };

  const addSpecItemHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const selector = createSelector();
    const specItem = createSpecItem(selector.id, SpecItemType.SELECTOR);
    dispatch(createNewSelector(selector));
    dispatch(addSpecItem(specItem));
  };
  const saveSpecHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingSpec());
    dispatch(clearEditingSpec());
  };

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
          onChange={(e) => dispatch(changeEditingSpecRoleKey(e.target.value))}
        />
      </FormGroupRowComponent>
      <SpecPreviewComponent />
      {props.spec.items.map((specItem, index) => (
        <SpecItemComponent
          key={specItem.id}
          specItem={specItem}
          required={index === 0}
        />
      ))}
      <Col sm="12" className="my-3">
        <Button
          variant="outline-primary"
          onClick={addSpecItemHandler}
          size="lg"
        >
          Add New Spec Item
        </Button>
      </Col>
      <Col sm="12" className="mb-1">
        <Button variant="primary" size="lg" onClick={saveSpecHandler}>
          Save
        </Button>
        <Button
          onClick={(_e) => dispatch(clearEditingSpec())}
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
