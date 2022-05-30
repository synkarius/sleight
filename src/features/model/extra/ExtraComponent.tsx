import React, { useId } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
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
  changeEditingExtraName,
  changeEditingExtraType,
  saveEditingExtra,
  clearEditingExtra,
} from './extra-reducers';
import { PanelComponent } from '../../ui/PanelComponent';
import { SelectorComponent } from '../selector/SelectorComponent';
import { Selector } from '../selector/selector';
import { ReduxFriendlyStringMap } from '../../../util/structures';

const getSelector = (
  variable: Extra,
  selectors: ReduxFriendlyStringMap<Selector>
): Selector | undefined => {
  switch (variable.type) {
    case VariableType.TEXT:
    case VariableType.RANGE:
      return selectors[variable.selectorIds[0]];
    default:
      return undefined;
  }
};

export const ExtraComponent: React.FC<{ extra: Extra }> = (props) => {
  const dispatch = useAppDispatch();
  const selectors = useAppSelector((state) => state.selector.saved);
  const nameInputId = useId();
  const typeInputId = useId();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingExtraName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeEditingExtraType(event.target.value));
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingExtra());
    dispatch(clearEditingExtra());
  };

  const selector = getSelector(props.extra, selectors);

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
      {selector && <SelectorComponent selector={selector} />}
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
