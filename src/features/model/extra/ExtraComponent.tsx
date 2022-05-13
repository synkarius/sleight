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
import { Extra } from './extra';
import { Range } from './range/range';
import { Choice } from './choice/choice';
import { VariableType } from './extra-types';
import { RangeComponent } from './range/RangeComponent';
import {
  editFocusedExtraName,
  editFocusedExtraType,
  upsertFocusedExtra,
  clearFocusedExtra,
} from './extra-reducers';
import { PanelComponent } from '../../ui/PanelComponent';

export const ExtraComponent: React.FC<{ extra: Extra }> = (props) => {
  const dispatch = useAppDispatch();
  const nameInputId = useId();
  const typeInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editFocusedExtraName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(editFocusedExtraType(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(upsertFocusedExtra());
    dispatch(clearFocusedExtra());
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
            value={props.extra.name}
          ></FormControl>
          <FormText className="text-muted">name of variable</FormText>
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
            value={props.extra.type}
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
      {props.extra.type === VariableType.RANGE && (
        <RangeComponent range={props.extra as Range} />
      )}
      {props.extra.type === VariableType.CHOICE && (
        <ChoiceComponent choice={props.extra as Choice} />
      )}
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
    </PanelComponent>
  );
};
