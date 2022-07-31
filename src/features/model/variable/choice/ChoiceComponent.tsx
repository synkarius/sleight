import React, { useId } from 'react';
import { Button, FormGroup, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { createSelector } from '../../selector/data/selector-domain';
import { saveSelector } from '../../selector/selector-reducers';
import { addChoiceItem } from '../variable-reducers';
import { Choice, createChoiceItem } from './choice';
import { ChoiceItemComponent } from './ChoiceItemComponent';

export const ChoiceComponent: React.FC<{ choice: Choice }> = (props) => {
  const dispatch = useAppDispatch();
  const choicesId = useId();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const selector = createSelector();
    // TODO: this way creates orphans -- process them out somewhere
    dispatch(saveSelector(selector));
    dispatch(addChoiceItem(createChoiceItem(selector.id)));
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
