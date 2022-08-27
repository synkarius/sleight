import React, { useContext, useId } from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
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
  const checkboxId = useId();

  const addItemButton = Field.VAR_ADD_ITEM_BUTTON;
  const addHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: this way creates selector orphans -- process them out somewhere
    editingContext.localDispatchFn({
      type: VariableReducerActionType.ADD_CHOICE_ITEM,
      payload: createChoiceItem(createSelector()),
    });
    validationContext.touch(addItemButton);
  };
  const defaultEnabledChangedHandler = (
    _e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });
  };
  const defaultValueChangedHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_DEFAULT_CHOICE,
      payload: e.target.value,
    });
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const noChoiceItemsErrorMessage = errorResults([addItemButton]);

  return (
    <>
      <div>
        <Col sm="12" className="mb-3">
          <Button
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
        {noChoiceItemsErrorMessage && (
          <Col sm="12" className="mb-3">
            <span className="small text-danger">
              {noChoiceItemsErrorMessage}
            </span>
          </Col>
        )}
      </div>
      <FormGroup as={Row} controlId={choicesId}>
        {props.choice.items.map((choiceItem, index) => (
          <ChoiceItemComponent
            key={choiceItem.id}
            choiceItem={choiceItem}
            required={index === 0}
          />
        ))}
      </FormGroup>
      <div>
        <Row className="mb-3">
          <Col sm="12">
            <Form.Check
              type="checkbox"
              id={checkboxId}
              label="Use Default"
              onChange={defaultEnabledChangedHandler}
              checked={props.choice.defaultValue !== undefined}
            />
          </Col>
        </Row>
        {props.choice.defaultValue !== undefined && (
          <FormGroupRowComponent
            labelText="Default Value"
            descriptionText="value for when variable is optional in a spec"
          >
            <FormControl
              type="text"
              onChange={defaultValueChangedHandler}
              value={props.choice.defaultValue}
              aria-label={Field[Field.VAR_CHOICE_DEFAULT_VALUE]}
            />
          </FormGroupRowComponent>
        )}
      </div>
    </>
  );
};
