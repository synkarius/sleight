import React, { useContext, useId } from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { Field } from '../../../validation/validation-field';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { TextVariable } from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';

export const TextVariableComponent: React.FC<{ text: TextVariable }> = (
  props
) => {
  const editingContext = useContext(VariableEditingContext);
  const checkboxId = useId();
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
      type: VariableReducerActionType.CHANGE_DEFAULT_TEXT,
      payload: e.target.value,
    });
  };

  return (
    <>
      <Row className="mb-3">
        <Col sm="12">
          <Form.Check
            type="checkbox"
            id={checkboxId}
            label="Use Default"
            onChange={defaultEnabledChangedHandler}
            checked={props.text.defaultValue !== undefined}
          />
        </Col>
      </Row>
      <FormGroupRowComponent
        labelText="Default Value"
        descriptionText="value for when variable is optional in a spec"
        hidden={props.text.defaultValue === undefined}
      >
        <FormControl
          type="text"
          onChange={defaultValueChangedHandler}
          value={props.text.defaultValue}
          role="textbox"
          aria-label={Field[Field.VAR_TEXT_DEFAULT_VALUE]}
        />
      </FormGroupRowComponent>
    </>
  );
};
