import React from 'react';
import { Button } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { Selector } from './selector';
import { createNewSelectorItem } from './selector-reducers';
import { SelectorItemComponent } from './SelectorItemComponent';

export const SelectorComponent: React.FC<{ selector: Selector }> = (props) => {
  const dispatch = useAppDispatch();

  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(createNewSelectorItem(props.selector.id));
  };

  return (
    <>
      {props.selector.items.map((selectorItem) => (
        <SelectorItemComponent
          key={selectorItem.id}
          selectorId={props.selector.id}
          selectorItem={selectorItem}
        />
      ))}
      <Button className="mb-3" onClick={addHandler} variant="primary">
        Add Alternate
      </Button>
    </>
  );
};
