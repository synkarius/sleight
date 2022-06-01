import React, { useId } from 'react';
import { FormGroup, FormLabel, FormText, Row } from 'react-bootstrap';
import { Selector } from './selector';
import {
  SelectorButtonType,
  SelectorItemComponent,
  SelectorPositionData,
} from './SelectorItemComponent';

const getSelectorPositionData = (
  index: number,
  length: number
): SelectorPositionData => {
  return {
    selectorButtonType:
      index === 0 ? SelectorButtonType.ADD_NEW : SelectorButtonType.REMOVE,
    isLast: index === length - 1,
  };
};

export const SelectorComponent: React.FC<{
  selector: Selector;
  showLabel: boolean;
}> = (props) => {
  const selectorFormGroupId = useId();

  return (
    <FormGroup as={Row} className="mb-3" controlId={selectorFormGroupId}>
      {props.showLabel && <FormLabel>Selector</FormLabel>}
      {props.selector.items.map((selectorItem, index) => (
        <SelectorItemComponent
          key={selectorItem.id}
          selectorId={props.selector.id}
          selectorItem={selectorItem}
          selectorPositionData={getSelectorPositionData(
            index,
            props.selector.items.length
          )}
        />
      ))}
      <FormText className="text-muted">selector (what to say)</FormText>
    </FormGroup>
  );
};