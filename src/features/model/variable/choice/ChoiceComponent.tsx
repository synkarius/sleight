import React, { useId } from 'react';
import { Button, FormGroup, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { createSelector } from '../../selector/selector';
import { createNewSelector } from '../../selector/selector-reducers';
import { addChoiceItem } from '../variable-reducers';
import { Choice, createChoiceItem } from './choice';
import { ChoiceItemComponent } from './ChoiceItemComponent';

export const ChoiceComponent: React.FC<{ choice: Choice }> = (props) => {
  const dispatch = useAppDispatch();
  const choicesId = useId();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const selector = createSelector();
    // TODO: this way creates orphans -- process them out somewhere
    dispatch(createNewSelector(selector));
    dispatch(addChoiceItem(createChoiceItem(selector.id)));
  };

  return (
    <>
      <Button className="mb-3" onClick={addHandler} variant="primary">
        Add Choice
      </Button>
      <FormGroup as={Row} className="mb-3" controlId={choicesId}>
        {props.choice.items.map((choiceItem) => (
          <ChoiceItemComponent key={choiceItem.id} choiceItem={choiceItem} />
        ))}
      </FormGroup>
    </>
  );
};
