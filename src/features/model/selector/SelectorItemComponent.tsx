import React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { SelectorItem } from './selector';
import { deleteSelectorItem, editSelectorItem } from './selector-reducers';

export const SelectorItemComponent: React.FC<{
  selectorId: string;
  selectorItem: SelectorItem;
  key: string;
}> = (props) => {
  const dispatch = useAppDispatch();

  const changedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      editSelectorItem({
        selectorId: props.selectorId,
        selectorItemId: props.selectorItem.id,
        value: event.target.value,
      })
    );
  };
  const deleteHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      deleteSelectorItem({
        selectorId: props.selectorId,
        selectorItemId: props.selectorItem.id,
      })
    );
  };

  return (
    <InputGroup className="mb-3">
      <FormControl
        type="text"
        onChange={changedHandler}
        value={props.selectorItem.value}
      />
      <Button variant="outline-secondary" onClick={deleteHandler}>
        Remove
      </Button>
    </InputGroup>
  );
};
