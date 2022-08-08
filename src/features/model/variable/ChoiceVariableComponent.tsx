import React, { useContext, useId } from 'react';
import { Button, Col, FormGroup, Row } from 'react-bootstrap';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { createSelector } from '../selector/data/selector-domain';
import { ChoiceItemComponent } from './ChoiceItemComponent';
import { ChoiceVariable, createChoiceItem } from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';

export const ChoiceVariableComponent: React.FC<{ choice: ChoiceVariable }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const choicesId = useId();

  const addItemButton = Field.VAR_ADD_ITEM_BUTTON;
  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: this way creates selector orphans -- process them out somewhere
    editingContext.localDispatchFn({
      type: VariableReducerActionType.ADD_CHOICE_ITEM,
      payload: createChoiceItem(createSelector()),
    });
    validationContext.touch(addItemButton);
  };

  const errorResults = validationContext.getErrorResults();
  const noChoiceItemsErrorMessage = errorResults.find(
    (result) => result.field === addItemButton
  )?.message;

  return (
    <>
      <div>
        <Col sm="12" className="mb-2">
          <Button
            className="mb-3"
            onClick={addHandler}
            variant={
              !noChoiceItemsErrorMessage ? 'outline-primary' : 'outline-danger'
            }
            size="lg"
            aria-label={Field[addItemButton]}
          >
            Add Choice Item
          </Button>
        </Col>
        <Col sm="12" className="mb-3">
          {noChoiceItemsErrorMessage && (
            <span className="small text-danger">
              {noChoiceItemsErrorMessage}
            </span>
          )}
        </Col>
      </div>
      <FormGroup as={Row} className="mb-3" controlId={choicesId}>
        {props.choice.items.map((choiceItem, index) => (
          <ChoiceItemComponent
            key={choiceItem.id}
            choiceItem={choiceItem}
            required={index === 0}
          />
        ))}
      </FormGroup>
    </>
  );
};
