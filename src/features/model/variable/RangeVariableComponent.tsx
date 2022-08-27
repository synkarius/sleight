import { useContext, useId } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormText,
  Row,
} from 'react-bootstrap';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';
import { RangeVariable } from './data/variable';
import { Field } from '../../../validation/validation-field';
import { ValidationContext } from '../../../validation/validation-context';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';

export const RangeVariableComponent: React.FC<{ range: RangeVariable }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const numberInputId = useId();
  const checkboxId = useId();

  const minChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_RANGE_MIN,
      payload: +event.target.value,
    });
  };
  const maxChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_RANGE_MAX,
      payload: +event.target.value,
    });
    validationContext.touch(Field.VAR_RANGE_MAX);
  };
  const defaultEnabledChangedHandler = (
    _e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });
  };
  const defaultValueChangedHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_DEFAULT_NUMBER,
      payload: +e.target.value,
    });
  };

  const rangeMax = Field.VAR_RANGE_MAX;
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const rangeIsInvalidErrorMessage = errorResults([rangeMax]);

  return (
    <>
      <FormGroup as={Row} className="mb-3" controlId={numberInputId}>
        <Col sm="6">
          <FormControl
            type="number"
            min={0}
            onChange={minChangedHandler}
            value={props.range.beginInclusive}
            aria-label={Field[Field.VAR_RANGE_MIN]}
          />
          <FormText className="text-muted">minimum value</FormText>
        </Col>
        <Col sm="6">
          <FormControl
            type="number"
            min={0}
            onChange={maxChangedHandler}
            value={props.range.endInclusive}
            aria-label={Field[rangeMax]}
            onBlur={(_e) => validationContext.touch(rangeMax)}
            isInvalid={!!rangeIsInvalidErrorMessage}
          />
          <FormText className="text-muted">maximum value</FormText>
          <Form.Control.Feedback type="invalid">
            {rangeIsInvalidErrorMessage}
          </Form.Control.Feedback>
        </Col>
      </FormGroup>
      <div>
        <Row className="mb-3">
          <Col sm="12">
            <Form.Check
              type="checkbox"
              id={checkboxId}
              label="Use Default"
              onChange={defaultEnabledChangedHandler}
              checked={props.range.defaultValue !== undefined}
            />
          </Col>
        </Row>
        {props.range.defaultValue !== undefined && (
          <FormGroupRowComponent
            labelText="Default Value"
            descriptionText="value for when variable is optional in a spec"
          >
            <FormControl
              type="number"
              min={0}
              onChange={defaultValueChangedHandler}
              value={props.range.defaultValue}
              aria-label={Field[Field.VAR_RANGE_DEFAULT_VALUE]}
            />
          </FormGroupRowComponent>
        )}
      </div>
    </>
  );
};
