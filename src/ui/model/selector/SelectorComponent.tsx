import React, { useId } from 'react';
import { FormGroup, FormLabel, FormText, Row } from 'react-bootstrap';
import { Field } from '../../../validation/validation-field';
import { Selector } from '../../../data/model/selector/selector-domain';
import { SelectorButtonType } from './selector-button-type';
import {
  SelectorItemComponent,
  SelectorItemHandlerFunctions,
  SelectorPositionData,
} from './SelectorItemComponent';

const getSelectorPositionData = (
  index: number,
  length: number
): SelectorPositionData => {
  return {
    selectorButtonType:
      index === 0
        ? SelectorButtonType.Enum.ADD_NEW
        : SelectorButtonType.Enum.REMOVE,
    isLast: index === length - 1,
  };
};

export const SelectorComponent: React.FC<{
  field: Field;
  selector: Selector;
  showLabel: boolean;
  selectorItemHandlers: SelectorItemHandlerFunctions;
}> = (props) => {
  const selectorFormGroupId = useId();

  return (
    <FormGroup as={Row} className="mb-3" controlId={selectorFormGroupId}>
      {props.showLabel && <FormLabel>Selector</FormLabel>}
      {props.selector.items.map((selectorItem, index) => (
        <SelectorItemComponent
          key={selectorItem.id}
          selectorItem={selectorItem}
          selectorPositionData={getSelectorPositionData(
            index,
            props.selector.items.length
          )}
          handlers={props.selectorItemHandlers}
          field={props.field}
        />
      ))}
      <FormText className="text-muted">selector (what to say)</FormText>
    </FormGroup>
  );
};
