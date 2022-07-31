import React, { useContext } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { ValidationResultType } from '../../../validation/validation-result';
import { SelectorItem } from './data/selector-domain';
import { SelectorButtonType } from './selector-button-type';

export type SelectorPositionData = {
  selectorButtonType: SelectorButtonType.Type;
  isLast: boolean;
};

export type SelectorItemHandlerFunctions = {
  add: () => void;
  change: (selectorItemId: string, value: string) => void;
  delete: (selectorItemId: string) => void;
};

export const SelectorItemComponent: React.FC<{
  field: Field;
  selectorItem: SelectorItem;
  selectorPositionData: SelectorPositionData;
  handlers: SelectorItemHandlerFunctions;
}> = (props) => {
  const validationContext = useContext(ValidationContext);

  // 1: extract error results for this field from the rest of the errors
  const errorResultsForThisField = validationContext
    .getErrorResults()
    .map(
      (result) =>
        (result.type === ValidationResultType.ID_LIST &&
          result.field === props.field &&
          result) ||
        undefined
    );
  const enteredValueIsInvalid = (): boolean => {
    // 2: this particular selector item is invalid if its id is in the list
    return (
      errorResultsForThisField
        .map((result) => result && result.ids.includes(props.selectorItem.id))
        .reduce((a, b) => a || b) || false
    );
  };
  const errorMessage = (): string | undefined => {
    // 3: error message should show if this is the last selector item in the group
    //    AND any in the group are invalid
    return (
      (props.selectorPositionData.isLast &&
        errorResultsForThisField
          .map((result) => (result && result.message) || '')
          .reduce((a, b) => a + b)) ||
      undefined
    );
  };

  return (
    <InputGroup className={props.selectorPositionData.isLast ? 'mb-0' : 'mb-3'}>
      <FormControl
        type="text"
        role="textbox"
        aria-label={Field[props.field]}
        onChange={(e) => {
          props.handlers.change(props.selectorItem.id, e.target.value);
          validationContext.touch(props.field);
        }}
        onBlur={(_e) => validationContext.touch(props.field)}
        value={props.selectorItem.value}
        isInvalid={enteredValueIsInvalid()}
      />
      {props.selectorPositionData.selectorButtonType ===
        SelectorButtonType.Enum.ADD_NEW && (
        <Button variant="outline-primary" onClick={props.handlers.add}>
          Add Alternate
        </Button>
      )}
      {props.selectorPositionData.selectorButtonType ===
        SelectorButtonType.Enum.REMOVE && (
        <Button
          variant="outline-secondary"
          onClick={(_e) => {
            props.handlers.delete(props.selectorItem.id);
            validationContext.touch(props.field);
          }}
        >
          Remove
        </Button>
      )}
      <Form.Control.Feedback type="invalid">
        {errorMessage()}
      </Form.Control.Feedback>
    </InputGroup>
  );
};
