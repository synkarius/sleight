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
import { RangeVariable } from '../../../data/model/variable/variable';
import { Field } from '../../../validation/validation-field';
import { ValidationContext } from '../../../validation/validation-context';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { USE_DEFAULT } from '../../../core/common/consts';
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { fieldName } from '../../../validation/field-name';

export const RangeVariableComponent: React.FC<{ range: RangeVariable }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const numberInputId = useId();
  const checkboxId = useId();

  const minChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_RANGE_MIN,
      payload: +event.target.value,
    });
    validationContext.touch(Field.VAR_RANGE_MIN);
  };
  const maxChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_RANGE_MAX,
      payload: +event.target.value,
    });
    validationContext.touch(Field.VAR_RANGE_MAX);
  };
  const defaultEnabledChangedHandler = (
    _e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });
    validationContext.touch(Field.VAR_USE_DEFAULT);
  };
  const defaultValueChangedHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_DEFAULT_NUMBER,
      payload: +e.target.value,
    });
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const rangeMinInvalidMessage = errorResults(Field.VAR_RANGE_MIN);
  const rangeMaxInvalidMessage = errorResults(Field.VAR_RANGE_MAX);

  return (
    <>
      <FormGroup as={Row} className="mb-3" controlId={numberInputId}>
        <Col sm="6">
          <FormControl
            type="number"
            onChange={minChangedHandler}
            value={props.range.beginInclusive}
            aria-label={fieldName(Field.VAR_RANGE_MIN)}
            onBlur={() => validationContext.touch(Field.VAR_RANGE_MIN)}
            isInvalid={!!rangeMinInvalidMessage}
          />
          <FormText className="text-muted">minimum value</FormText>
          <Form.Control.Feedback type="invalid">
            {rangeMinInvalidMessage}
          </Form.Control.Feedback>
        </Col>
        <Col sm="6">
          <FormControl
            type="number"
            onChange={maxChangedHandler}
            value={props.range.endInclusive}
            aria-label={fieldName(Field.VAR_RANGE_MAX)}
            onBlur={() => validationContext.touch(Field.VAR_RANGE_MAX)}
            isInvalid={!!rangeMaxInvalidMessage}
          />
          <FormText className="text-muted">maximum value</FormText>
          <Form.Control.Feedback type="invalid">
            {rangeMaxInvalidMessage}
          </Form.Control.Feedback>
        </Col>
      </FormGroup>
      <div>
        <Row className="mb-3">
          <Col sm="12">
            <Form.Check
              type="checkbox"
              id={checkboxId}
              label={USE_DEFAULT}
              onChange={defaultEnabledChangedHandler}
              onBlur={() => validationContext.touch(Field.VAR_USE_DEFAULT)}
              checked={props.range.defaultValue !== undefined}
              isInvalid={!!errorResults(Field.VAR_USE_DEFAULT)}
            />
          </Col>
          <ErrorTextComponent
            errorMessage={errorResults(Field.VAR_USE_DEFAULT)}
          />
        </Row>
        {props.range.defaultValue !== undefined && (
          <FormGroupRowComponent
            labelText="Default Value"
            descriptionText="value for when variable is optional in a spec"
          >
            <FormControl
              type="number"
              onChange={defaultValueChangedHandler}
              value={props.range.defaultValue}
              aria-label={fieldName(Field.VAR_RANGE_DEFAULT_VALUE)}
            />
          </FormGroupRowComponent>
        )}
      </div>
    </>
  );
};
