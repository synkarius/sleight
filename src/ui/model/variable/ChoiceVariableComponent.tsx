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
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { USE_DEFAULT } from '../../../core/common/consts';
import { createSelector } from '../../../data/model/selector/selector-domain';
import { ChoiceItemComponent } from './ChoiceItemComponent';
import {
  ChoiceVariable,
  createChoiceItem,
} from '../../../data/model/variable/variable';
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
    editingContext.localDispatch({
      type: VariableReducerActionType.ADD_CHOICE_ITEM,
      payload: createChoiceItem(createSelector()),
    });
    validationContext.touch(addItemButton);
  };
  const defaultEnabledChangedHandler = (
    _e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.TOGGLE_DEFAULT_ENABLED,
    });
    validationContext.touch(Field.VAR_USE_DEFAULT);
  };
  const defaultValueChangedHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_DEFAULT_CHOICE,
      payload: e.target.value,
    });
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const noChoiceItemsErrorMessage = errorResults(addItemButton);

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
        <ErrorTextComponent
          errorMessage={noChoiceItemsErrorMessage}
          row={true}
        />
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
              label={USE_DEFAULT}
              onChange={defaultEnabledChangedHandler}
              onBlur={() => validationContext.touch(Field.VAR_USE_DEFAULT)}
              checked={props.choice.defaultValue !== undefined}
              isInvalid={!!errorResults(Field.VAR_USE_DEFAULT)}
            />
          </Col>
          <ErrorTextComponent
            errorMessage={errorResults(Field.VAR_USE_DEFAULT)}
          />
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
