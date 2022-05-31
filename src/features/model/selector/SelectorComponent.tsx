import React, { useId } from 'react';
import { FormGroup, FormLabel, FormText, Row } from 'react-bootstrap';
import { ArrayPositionType } from '../../../util/bootstrap-util';
import { Selector } from './selector';
import { SelectorItemComponent } from './SelectorItemComponent';

export const SelectorComponent: React.FC<{ selector: Selector }> = (props) => {
  const selectorFormGroupId = useId();

  return (
    <FormGroup as={Row} className="mb-3" controlId={selectorFormGroupId}>
      <FormLabel>Selector</FormLabel>
      {props.selector.items.map((selectorItem, index) => (
        <SelectorItemComponent
          key={selectorItem.id}
          selectorId={props.selector.id}
          selectorItem={selectorItem}
          arrayPositionType={ArrayPositionType.getArrayPositionType(
            props.selector.items.length,
            index
          )}
        />
      ))}
      <FormText className="text-muted">selector (what to say)</FormText>
    </FormGroup>
  );
};
