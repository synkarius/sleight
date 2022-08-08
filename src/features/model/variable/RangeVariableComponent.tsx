import { useContext, useId } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
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

export const RangeVariableComponent: React.FC<{ range: RangeVariable }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const numberInputId = useId();

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

  const rangeMax = Field.VAR_RANGE_MAX;
  const rangeIsInvalidErrorMessage = validationContext
    .getErrorResults()
    .find((errorResult) => errorResult.field === rangeMax)?.message;

  return (
    <FormGroup as={Row} className="mb-3" controlId={numberInputId}>
      <FormLabel column sm="2"></FormLabel>
      <Col sm="4">
        <FormControl
          type="number"
          min={0}
          onChange={minChangedHandler}
          value={props.range.beginInclusive}
          aria-label={Field[Field.VAR_RANGE_MIN]}
        />
        <FormText className="text-muted">minimum value</FormText>
      </Col>
      <Col sm="4">
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
  );
};
