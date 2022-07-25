import React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { createSelectorItem, SelectorItem } from './selector';
import { SelectorButtonType } from './selector-button-type';
import {
  createNewSelectorItem,
  deleteSelectorItem,
  editSelectorItem,
} from './selector-reducers';

export type SelectorPositionData = {
  selectorButtonType: SelectorButtonType.Type;
  isLast: boolean;
};

export const SelectorItemComponent: React.FC<{
  selectorId: string;
  selectorItem: SelectorItem;
  key: string;
  selectorPositionData: SelectorPositionData;
}> = (props) => {
  const dispatch = useAppDispatch();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      createNewSelectorItem({
        selectorId: props.selectorId,
        selectorItem: createSelectorItem(),
      })
    );
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

  const marginBottom = props.selectorPositionData.isLast ? 'mb-0' : 'mb-3';

  return (
    <InputGroup className={marginBottom}>
      <FormControl
        type="text"
        onChange={changedHandler}
        value={props.selectorItem.value}
      />
      {props.selectorPositionData.selectorButtonType ===
        SelectorButtonType.Enum.ADD_NEW && (
        <Button variant="outline-primary" onClick={addHandler}>
          Add Alternate
        </Button>
      )}
      {props.selectorPositionData.selectorButtonType ===
        SelectorButtonType.Enum.REMOVE && (
        <Button variant="outline-secondary" onClick={deleteHandler}>
          Remove
        </Button>
      )}
    </InputGroup>
  );
};
