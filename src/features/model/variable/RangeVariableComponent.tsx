import { useContext, useId } from 'react';
import {
  Col,
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

export const RangeVariableComponent: React.FC<{ range: RangeVariable }> = (
  props
) => {
  const editingContext = useContext(VariableEditingContext);
  const numberInputId = useId();

  const fromChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_RANGE_MIN,
      payload: +event.target.value,
    });
  };
  const toChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_RANGE_MAX,
      payload: +event.target.value,
    });
  };

  return (
    <FormGroup as={Row} className="mb-3" controlId={numberInputId}>
      <FormLabel column sm="2"></FormLabel>
      <Col sm="4">
        <FormControl
          type="number"
          min={0}
          onChange={fromChangedHandler}
          value={props.range.beginInclusive}
        ></FormControl>
        <FormText className="text-muted">minimum value</FormText>
      </Col>
      <Col sm="4">
        <FormControl
          type="number"
          min={0}
          onChange={toChangedHandler}
          value={props.range.endInclusive}
        ></FormControl>
        <FormText className="text-muted">maximum value</FormText>
      </Col>
    </FormGroup>
  );
};
