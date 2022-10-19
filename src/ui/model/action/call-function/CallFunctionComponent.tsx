import React, { useContext } from 'react';
import { CallFunctionAction } from '../../../../data/model/action/call-function/call-function';
import { FnDropdownComponent } from '../../fn/FnDropdownComponent';
import { Field } from '../../../../validation/validation-field';
import { FormGroupRowComponent } from '../../../other-components/FormGroupRowComponent';
import { useAppSelector } from '../../../../app/hooks';
import { ActionValueComponent } from '../ActionValueComponent';
import { ActionValueFieldGroup } from '../action-value-type-name-group';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { ValidationContext } from '../../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import {
  ActionValue,
  createEnumValue,
  createNumberValue,
  createTextValue,
} from '../../../../data/model/action/action-value';
import { UNSELECTED_ID } from '../../../../core/common/consts';
import { processErrorResults } from '../../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../../other-components/ErrorTextComponent';

export const CallFunctionComponent: React.FC<{
  callFunctionAction: CallFunctionAction;
}> = (props) => {
  const fns = useAppSelector((state) => state.fn.saved);
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const fn = fns[props.callFunctionAction.functionId];

  const getActionValueFieldGroup = (index: number): ActionValueFieldGroup => {
    const param = fn.parameters[index];
    const paramType = param.type;
    const common = {
      radio: Field.AC_CALL_FUNC_PARAMETER_RADIO,
      value: Field.AC_CALL_FUNC_PARAMETER_VALUE,
      variable: Field.AC_CALL_FUNC_PARAMETER_VAR,
      id: props.callFunctionAction.parameters[index].id,
    };
    switch (paramType) {
      case VariableType.Enum.TEXT:
        return { ...common, type: paramType };
      case VariableType.Enum.NUMBER:
        // TODO: allow specifying min/max on Fn
        return { ...common, type: paramType };
      case VariableType.Enum.ENUM:
        // TODO: allow specifying enum values on Fn
        return { ...common, type: paramType, enumValues: [] };
      default:
        throw new ExhaustivenessFailureError(paramType);
    }
  };
  const fnChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFnId = event.target.value;
    const newFn = fns[newFnId];
    const getDefaultActionValues = (): ActionValue[] => {
      if (newFn) {
        return newFn.parameters.map((param) => {
          const paramType = param.type;
          switch (paramType) {
            case VariableType.Enum.TEXT:
              return createTextValue();
            case VariableType.Enum.NUMBER:
              return createNumberValue();
            case VariableType.Enum.ENUM:
              return createEnumValue();
            default:
              throw new ExhaustivenessFailureError(paramType);
          }
        });
      }
      return [];
    };

    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_FN,
      payload: {
        functionId: newFnId,
        defaultActionValues: getDefaultActionValues(),
      },
    });
    validationContext.touch(Field.AC_CALL_FUNC_FN);
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <>
      <FormGroupRowComponent
        labelText="Function"
        descriptionText="function to call"
        errorMessage={errorResults([Field.AC_CALL_FUNC_FN])}
      >
        <FnDropdownComponent
          field={Field.AC_CALL_FUNC_FN}
          fnId={fn?.id || UNSELECTED_ID}
          onChange={fnChangedHandler}
          onBlur={() => {
            validationContext.touch(Field.AC_CALL_FUNC_FN);
          }}
          isInvalid={!!errorResults([Field.AC_CALL_FUNC_FN])}
        />
      </FormGroupRowComponent>
      {fn &&
        fn.parameters.map((param, index) => (
          <FormGroupRowComponent
            labelText={'Custom Parameter'}
            key={param.name + index}
            errorMessage={errorResults(
              [Field.AC_CALL_FUNC_PARAMETER_VAR],
              param.id
            )}
          >
            <ActionValueComponent
              fields={getActionValueFieldGroup(index)}
              actionValue={props.callFunctionAction.parameters[index]}
              labelText={param.name}
              descriptionText={`parameter "${param.name}" for function "${fn.name}"`}
            />
            <ErrorTextComponent
              errorMessage={errorResults(
                [Field.AC_CALL_FUNC_PARAMETER_VAR],
                param.id
              )}
            />
          </FormGroupRowComponent>
        ))}
    </>
  );
};
