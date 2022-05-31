import React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { ArrayPositionType } from '../../../util/bootstrap-util';
import { SelectorItem } from './selector';
import {
  createNewSelectorItem,
  deleteSelectorItem,
  editSelectorItem,
} from './selector-reducers';

export const SelectorItemComponent: React.FC<{
  selectorId: string;
  selectorItem: SelectorItem;
  key: string;
  arrayPositionType: string;
}> = (props) => {
  const dispatch = useAppDispatch();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(createNewSelectorItem(props.selectorId));
  };
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

  const marginBottom =
    props.arrayPositionType === ArrayPositionType.LAST ? 'mb-0' : 'mb-3';

  return (
    <InputGroup className={marginBottom}>
      <FormControl
        type="text"
        onChange={changedHandler}
        value={props.selectorItem.value}
      />
      {props.arrayPositionType === ArrayPositionType.FIRST && (
        <Button variant="outline-primary" onClick={addHandler}>
          Add Alternate
        </Button>
      )}
      {props.arrayPositionType !== ArrayPositionType.FIRST && (
        <Button variant="outline-secondary" onClick={deleteHandler}>
          Remove
        </Button>
      )}
    </InputGroup>
  );
};
