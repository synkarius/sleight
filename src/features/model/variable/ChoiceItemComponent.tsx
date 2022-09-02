import { useContext } from 'react';
import { Button, Col, FormControl, FormText, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { RequiredAsteriskComponent } from '../../ui/RequiredAsteriskComponent';
import { createSelectorItem } from '../selector/data/selector-domain';
import { SelectorComponent } from '../selector/SelectorComponent';
import { ChoiceItem } from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';

export const ChoiceItemComponent: React.FC<{
  choiceItem: ChoiceItem;
  required?: boolean;
}> = (props) => {
  const editingContext = useContext(VariableEditingContext);

  const changechoiceItemValueHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.EDIT_CHOICE_ITEM,
      payload: {
        choiceItemId: props.choiceItem.id,
        value: e.target.value,
      },
    });
  };
  const removeChoiceItemHandler = (_e: React.MouseEvent<HTMLButtonElement>) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.DELETE_CHOICE_ITEM,
      payload: props.choiceItem.id,
    });
  };
  const addSelectorItemHandler = () => {
    editingContext.localDispatch({
      type: VariableReducerActionType.ADD_SELECTOR_ITEM,
      payload: {
        choiceItemId: props.choiceItem.id,
        selectorItem: createSelectorItem(),
      },
    });
  };
  const changeSelectorItemHandler = (selectorItemId: string, value: string) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.EDIT_SELECTOR_ITEM,
      payload: {
        choiceItemId: props.choiceItem.id,
        selectorItemId: selectorItemId,
        value: value,
      },
    });
  };
  const deleteSelectorItemHandler = (selectorItemId: string) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.DELETE_SELECTOR_ITEM,
      payload: {
        choiceItemId: props.choiceItem.id,
        selectorItemId: selectorItemId,
      },
    });
  };

  return (
    <>
      <Row className="mb-3">
        <Col sm="12">
          <span>Choice Item</span>
          <RequiredAsteriskComponent required={!!props.required} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm="5">
          <SelectorComponent
            field={Field.VAR_CHOICE_ITEM_SELECTOR}
            selector={props.choiceItem.selector}
            showLabel={false}
            selectorItemHandlers={{
              add: addSelectorItemHandler,
              change: changeSelectorItemHandler,
              delete: deleteSelectorItemHandler,
            }}
          />
        </Col>
        <Col sm="5">
          <FormControl
            type="text"
            onChange={changechoiceItemValueHandler}
            value={props.choiceItem.value}
          ></FormControl>
          <FormText className="text-muted">
            value (what the action uses)
          </FormText>
        </Col>
        <Col sm="2">
          <Button
            onClick={removeChoiceItemHandler}
            variant="warning"
            type="submit"
          >
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
};
