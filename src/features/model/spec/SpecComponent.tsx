import React, { useId } from 'react';
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from 'react-bootstrap';
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

export const SpecComponent: React.FC<{ spec: Spec }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const roleKeyId = useId();

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
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.spec.name}
        />
        <FormText className="text-muted">name of spec</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.spec.roleKeyId}
          payloadFn={(id) => changeEditingSpecRoleKey(id)}
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      {props.spec.items.map((specItem) => (
        <SpecItemComponent key={specItem.id} specItem={specItem} />
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
      </Col>
    </PanelComponent>
  );
};
