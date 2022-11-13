import React, { useContext } from 'react';
import { FormControl, FormSelect } from 'react-bootstrap';
import { LIST, LIST_ITEM } from '../../../core/common/accessibility-roles';
import { FnParameter } from '../../../data/model/fn/fn';
import { VariableType } from '../../../data/model/variable/variable-types';
import { fieldName } from '../../../validation/field-name';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { FnEditingContext, FnReducerActionType } from './fn-editing-context';

export const FnParameterComponent: React.FC<{ param: FnParameter }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(FnEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_PARAMETER_NAME,
      payload: {
        id: props.param.id,
        value: event.target.value,
      },
    });
    validationContext.touch(Field.FN_PARAMETER_NAME);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: FnReducerActionType.CHANGE_PARAMETER_TYPE,
      payload: {
        id: props.param.id,
        value: event.target.value as VariableType.Type,
      },
    });
    validationContext.touch(Field.FN_PARAMETER_TYPE);
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const paramNameErrorResult = errorResults(
    Field.FN_PARAMETER_NAME,
    props.param.id
  );

  return (
    <>
      <FormGroupRowComponent
        labelText="Parameter Name"
        descriptionText="name of parameter"
        errorMessage={paramNameErrorResult}
      >
        <FormControl
          aria-label={fieldName(Field.FN_PARAMETER_NAME)}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_PARAMETER_NAME)}
          isInvalid={!!paramNameErrorResult}
          value={props.param.name}
        />
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Parameter Type"
        descriptionText="type of parameter"
        errorMessage={errorResults(Field.FN_PARAMETER_TYPE, props.param.id)}
      >
        <FormSelect
          aria-label={fieldName(Field.FN_PARAMETER_TYPE)}
          onChange={typeChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_PARAMETER_TYPE)}
          value={props.param.type}
          role={LIST}
          isInvalid={!!errorResults(Field.FN_PARAMETER_TYPE, props.param.id)}
        >
          {VariableType.values().map((vt) => (
            <option key={vt} value={vt} role={LIST_ITEM}>
              {vt}
            </option>
          ))}
        </FormSelect>
      </FormGroupRowComponent>
    </>
  );
};
