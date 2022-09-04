import React, { useContext, useId } from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../other-components/ErrorTextComponent';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { USE_DEFAULT } from '../../../common/consts';
import { TextVariable } from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';

export const TextVariableComponent: React.FC<{ text: TextVariable }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const checkboxId = useId();
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
      type: VariableReducerActionType.CHANGE_DEFAULT_TEXT,
      payload: e.target.value,
    });
  };
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const useDefaultError = errorResults([Field.VAR_USE_DEFAULT]);

  return (
    <>
      <Row className="mb-3">
        <Col sm="12">
          <Form.Check
            type="checkbox"
            id={checkboxId}
            label={USE_DEFAULT}
            onChange={defaultEnabledChangedHandler}
            onBlur={() => validationContext.touch(Field.VAR_USE_DEFAULT)}
            checked={props.text.defaultValue !== undefined}
            isInvalid={!!useDefaultError}
          />
        </Col>
        <ErrorTextComponent errorMessage={useDefaultError} />
      </Row>
      {props.text.defaultValue !== undefined && (
        <FormGroupRowComponent
          labelText="Default Value"
          descriptionText="value for when variable is optional in a spec"
        >
          <FormControl
            type="text"
            onChange={defaultValueChangedHandler}
            value={props.text.defaultValue}
            aria-label={Field[Field.VAR_TEXT_DEFAULT_VALUE]}
          />
        </FormGroupRowComponent>
      )}
    </>
  );
};
