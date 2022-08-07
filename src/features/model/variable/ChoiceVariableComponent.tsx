import React, { useContext, useId } from 'react';
import { Button, FormGroup, Row } from 'react-bootstrap';
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
  const editingContext = useContext(VariableEditingContext);
  const choicesId = useId();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: this way creates selector orphans -- process them out somewhere
    editingContext.localDispatchFn({
      type: VariableReducerActionType.ADD_CHOICE_ITEM,
      payload: createChoiceItem(createSelector()),
    });
  };

  return (
    <>
      <Button
        className="mb-3"
        onClick={addHandler}
        variant="outline-primary"
        size="lg"
      >
        Add Choice Item
      </Button>
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
