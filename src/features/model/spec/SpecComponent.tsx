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
    <PanelComponent>
      <FormGroup as={Row} className="mb-3" controlId={nameInputId}>
        <FormLabel column sm="2">
          Name
        </FormLabel>
        <Col sm="6">
          <FormControl
            type="text"
            onChange={nameChangedHandler}
            value={props.spec.name}
          ></FormControl>
          <FormText className="text-muted">name of spec</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={roleKeyId}>
        <FormLabel column sm="2">
          Role Key
        </FormLabel>
        <Col sm="6">
          <RoleKeyDropdownComponent
            roleKeyId={props.spec.roleKeyId}
            payloadFn={(id) => changeEditingSpecRoleKey(id)}
          />
          <FormText className="text-muted">role of variable</FormText>
        </Col>
      </FormGroup>
      {props.spec.items.map((specItem) => (
        <SpecItemComponent key={specItem.id} specItem={specItem} />
      ))}
      <Col sm="12" className="my-3">
        <Button
          className="mx-3"
          variant="outline-primary"
          onClick={addSpecItemHandler}
        >
          Add New Spec Item
        </Button>
      </Col>
      <Col sm="12" className="mb-3">
        <Button className="mx-3" variant="primary" onClick={saveSpecHandler}>
          Save Spec
        </Button>
      </Col>
    </PanelComponent>
  );
};
