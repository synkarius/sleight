import React, { useId } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import {
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Button,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { ChoiceComponent } from './choice/ChoiceComponent';
import { Variable } from './variable';
import { Range } from './range/range';
import { Choice } from './choice/choice';
import { VariableType } from './variable-types';
import { RangeComponent } from './range/RangeComponent';
import {
  changeEditingVariableName,
  changeEditingVariableType,
  saveEditingVariable,
  clearEditingVariable,
  changeEditingVariableRoleKey,
} from './variable-reducers';
import { PanelComponent } from '../../ui/PanelComponent';
import { createSelector } from '../selector/selector';
import { createNewSelector } from '../selector/selector-reducers';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';

export const VariableComponent: React.FC<{ variable: Variable }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const roleKeyId = useId();
  const typeInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingVariableName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariableType = event.target.value;
    let selectorId: string | null = null;
    if (newVariableType === VariableType.CHOICE) {
      const selector = createSelector();
      selectorId = selector.id;
      dispatch(createNewSelector(selector));
    }
    dispatch(
      changeEditingVariableType({
        variableType: newVariableType,
        selectorId: selectorId,
      })
    );
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingVariable());
    dispatch(clearEditingVariable());
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
            value={props.variable.name}
          ></FormControl>
          <FormText className="text-muted">name of variable</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={roleKeyId}>
        <FormLabel column sm="2">
          Role Key
        </FormLabel>
        <Col sm="6">
          <RoleKeyDropdownComponent
            roleKeyId={props.variable.roleKeyId}
            payloadFn={(id) => changeEditingVariableRoleKey(id)}
          />
          <FormText className="text-muted">role of variable</FormText>
        </Col>
      </FormGroup>
      <FormGroup as={Row} className="mb-3" controlId={typeInputId}>
        <FormLabel column sm="2">
          Type
        </FormLabel>
        <Col sm="6">
          <Form.Select
            aria-label="Variable type selection"
            onChange={typeChangedHandler}
            value={props.variable.type}
          >
            {VariableType.values().map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </Form.Select>
          <FormText className="text-muted">kind of variable</FormText>
        </Col>
      </FormGroup>
      {props.variable.type === VariableType.RANGE && (
        <RangeComponent range={props.variable as Range} />
      )}
      {props.variable.type === VariableType.CHOICE && (
        <ChoiceComponent choice={props.variable as Choice} />
      )}
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
