import React, { useId } from 'react';
import { Button, FormGroup, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { addChoiceItem } from '../extra-reducers';
import { Choice } from './choice';
import { ChoiceItemComponent } from './ChoiceItemComponent';

export const ChoiceComponent: React.FC<{ choice: Choice }> = (props) => {
  const dispatch = useAppDispatch();
  const choicesId = useId();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(addChoiceItem());
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
