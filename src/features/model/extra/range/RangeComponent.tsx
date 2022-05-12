import { useId, useState } from 'react';
import { useAppDispatch } from '../../../../app/hooks';
import {
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from 'react-bootstrap';
import { Range } from './range';
import { editRangeMax, editRangeMin } from '../extra-reducers';

export const RangeComponent: React.FC<{ range: Range }> = (props) => {
  const dispatch = useAppDispatch();
  const numberInputId = useId();

  const fromChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editRangeMin(+event.target.value));
  };
  const toChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editRangeMax(+event.target.value));
  };

  return (
    <FormGroup as={Row} className="mb-3" controlId={numberInputId}>
      <FormLabel column sm="2">
        Number Range
      </FormLabel>
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
