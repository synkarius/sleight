import React, { useContext } from 'react';
import { FormControl } from 'react-bootstrap';
import { FnParameter } from '../../../data/model/fn/fn';
import { VariableType } from '../../../data/model/variable/variable-types';
import { ValidationContext } from '../../../validation/validation-context';
import { Field } from '../../../validation/validation-field';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { PanelComponent } from '../../other-components/PanelComponent';
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

  return (
    <PanelComponent>
      <FormGroupRowComponent
        labelText="Parameter Name"
        descriptionText="name of parameter"
        errorMessage={errorResults([Field.FN_PARAMETER_NAME])}
      >
        <FormControl
          aria-label={Field[Field.FN_PARAMETER_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.FN_PARAMETER_NAME)}
          isInvalid={!!errorResults([Field.FN_PARAMETER_NAME])}
          value={props.param.name}
        />
      </FormGroupRowComponent>
    </PanelComponent>
  );
};
