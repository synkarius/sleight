import React, { useContext } from 'react';
import { FormCheck, FormControl } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariableType } from '../../variable/variable-types';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import { ChoiceValue, RangeValue, TextValue } from './action-value';
import { ActionValueType } from './action-value-type';
import { getRelevantErrorMessage } from '../../../../validation/validator';
import { noOpValidator } from './action-value-validation';
import { ValidationContext } from '../../../../validation/validation-context';
import { FieldValidator } from '../../../../validation/field-validator';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { Field } from '../../../../validation/validation-field';
import { Action } from '../action';

type AVCProps = {
  // value
  actionValue: TextValue | RangeValue | ChoiceValue;
  // display
  labelText: string;
  descriptionText: string;
  // validation
  field: Field;
  required?: boolean;
  enterValueValidator?: FieldValidator<Action>;
  variableValidator?: FieldValidator<Action>;
  roleKeyValidator?: FieldValidator<Action>;
};

export const ActionValueComponent: React.FC<AVCProps> = (props) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);
  //
  const valueValidator = props.enterValueValidator || noOpValidator;
  const variableValidator = props.variableValidator || noOpValidator;
  const roleKeyValidator = props.roleKeyValidator || noOpValidator;

  const typeChangedFn = (type: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: props.field,
        value: type,
      },
    });
  };
  const touchEnteredValue = () => validationContext.touch(valueValidator.field);
  const enteredValueChangedFn = (value: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: valueValidator.field,
        value: value,
      },
    });
    touchEnteredValue();
  };
  const touchVariable = () => validationContext.touch(variableValidator.field);
  const variableIdChangedFn = (id: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: variableValidator.field,
        value: id,
      },
    });
    touchVariable();
  };
  const touchRoleKey = () => validationContext.touch(roleKeyValidator.field);
  const roleKeyIdChangedFn = (id: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: roleKeyValidator.field,
        value: id,
      },
    });
    touchRoleKey();
  };

  const validationErrors = validationContext.getErrors();
  const enteredValueIsInvalid = () =>
    validationErrors.includes(valueValidator.error);
  const variableSelectionIsInvalid = () =>
    validationErrors.includes(variableValidator.error);
  const roleKeySelectionIsInvalid = () =>
    validationErrors.includes(roleKeyValidator.error);
  const enteredValueFieldName =
    (valueValidator !== noOpValidator && Field[valueValidator.field]) ||
    undefined;
  const variableFieldName =
    (variableValidator !== noOpValidator && Field[variableValidator.field]) ||
    undefined;
  const roleKeyFieldName =
    (roleKeyValidator !== noOpValidator && Field[roleKeyValidator.field]) ||
    undefined;
  const variableTypeIsNumeric =
    props.actionValue.variableType === VariableType.RANGE;
  const errorMessage = getRelevantErrorMessage(validationErrors, [
    props.enterValueValidator,
    props.variableValidator,
    props.roleKeyValidator,
  ]);
  const isChecked = (actionValueType: string): boolean => {
    return props.actionValue.actionValueType === actionValueType;
  };

  return (
    <FormGroupRowComponent
      labelText={props.labelText}
      descriptionText={props.descriptionText}
      errorMessage={errorMessage}
      required={props.required}
    >
      <div role="radiogroup" aria-label={Field[props.field]}>
        {ActionValueType.values().map((actionValueType) => (
          <FormCheck
            inline
            label={actionValueType}
            key={actionValueType}
            type="radio"
            role="radio"
            checked={isChecked(actionValueType)}
            aria-checked={isChecked(actionValueType)}
            tabIndex={isChecked(actionValueType) ? 0 : -1}
            onChange={(_e) => typeChangedFn(actionValueType)}
          />
        ))}
      </div>
      {props.actionValue.actionValueType === ActionValueType.ENTER_VALUE &&
        !variableTypeIsNumeric && (
          <FormControl
            type="text"
            value={props.actionValue.value as string}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={enteredValueIsInvalid()}
            name={enteredValueFieldName}
            role="textbox"
            aria-label={enteredValueFieldName}
          />
        )}
      {props.actionValue.actionValueType === ActionValueType.ENTER_VALUE &&
        variableTypeIsNumeric && (
          <FormControl
            type="number"
            value={props.actionValue.value as number}
            min={0}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={enteredValueIsInvalid()}
            name={enteredValueFieldName}
            role="input"
            aria-label={enteredValueFieldName}
          />
        )}
      {props.actionValue.actionValueType === ActionValueType.USE_VARIABLE && (
        <VariablesDropdownComponent
          selectedVariableId={props.actionValue.variableId as string}
          onChange={(e) => variableIdChangedFn(e.target.value)}
          onBlur={(_e) => touchVariable()}
          isInvalid={variableSelectionIsInvalid()}
          variableTypeFilter={[props.actionValue.variableType]}
          name={variableFieldName}
        />
      )}
      {props.actionValue.actionValueType === ActionValueType.USE_ROLE_KEY && (
        <RoleKeyDropdownComponent
          roleKeyId={props.actionValue.roleKeyId}
          onChange={(e) => roleKeyIdChangedFn(e.target.value)}
          onBlur={(_e) => touchRoleKey()}
          isInvalid={roleKeySelectionIsInvalid()}
          name={roleKeyFieldName}
        />
      )}
    </FormGroupRowComponent>
  );
};
