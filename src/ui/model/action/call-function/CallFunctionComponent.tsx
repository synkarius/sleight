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
  FnEditingContext,
  FnReducerActionType,
} from '../../fn/fn-editing-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';

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
      // TODO: some kind of per-parameter identifier... might need to be index?
      //id: props.callFunctionAction.parameters[index].
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
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_FN,
      payload: event.target.value,
    });
  };

  return (
    <>
      <FormGroupRowComponent
        labelText="Function"
        descriptionText="function to call"
      >
        <FnDropdownComponent
          field={Field.AC_CALL_FUNC_FN}
          fnId={fn?.id}
          onChange={fnChangedHandler}
          onBlur={() => {
            validationContext.touch(Field.AC_CALL_FUNC_FN);
          }}
        />
      </FormGroupRowComponent>
      {fn &&
        fn.parameters.map((param, index) => (
          <FormGroupRowComponent labelText={param.name}>
            <ActionValueComponent
              fields={getActionValueFieldGroup(index)}
              actionValue={props.callFunctionAction.parameters[index]}
              labelText="TODO-label"
              descriptionText="TODO-descr"
            />
          </FormGroupRowComponent>
        ))}
    </>
  );
};
