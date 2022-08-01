import React, { useContext } from 'react';
import { FormCheck, FormControl } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import { ActionValueType } from './action-value-type';
import { getRelevantErrorMessage } from '../../../../validation/field-validator';
import { ValidationContext } from '../../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { Field } from '../../../../validation/validation-field';
import {
  EnterValueType,
  NumericActionValue,
  TextActionValue,
} from './action-value';

type ActionValueFields = {
  radio: Field;
  value: Field;
  variable: Field;
  roleKey: Field;
};

type AVCProps = {
  // value
  actionValue: TextActionValue | NumericActionValue;
  fields: ActionValueFields;
  // display
  labelText: string;
  descriptionText: string;
  required?: boolean;
};

export const ActionValueComponent: React.FC<AVCProps> = (props) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const typeChangedFn = (type: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: {
        field: props.fields.radio,
        actionValueType: type as ActionValueType.Type,
      },
    });
    validationContext.touch(props.fields.radio);
  };
  const touchEnteredValue = () => validationContext.touch(props.fields.value);
  const enteredValueChangedFn = (value: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload: {
        field: props.fields.value,
        value: value,
      },
    });
    touchEnteredValue();
  };
  const touchVariable = () => validationContext.touch(props.fields.variable);
  const variableIdChangedFn = (id: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: props.fields.variable,
        value: id,
      },
    });
    touchVariable();
  };
  const touchRoleKey = () => validationContext.touch(props.fields.roleKey);
  const roleKeyIdChangedFn = (id: string) => {
    editingContext.localDispatchFn({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ROLE_KEY_ID,
      payload: {
        field: props.fields.roleKey,
        value: id,
      },
    });
    touchRoleKey();
  };

  const errorResults = validationContext.getErrorResults();
  const errorResultFields = errorResults.map((result) => result.field);
  const enteredValueIsInvalid = () =>
    errorResultFields.includes(props.fields.value);
  const variableSelectionIsInvalid = () =>
    errorResultFields.includes(props.fields.variable);
  const roleKeySelectionIsInvalid = () =>
    errorResultFields.includes(props.fields.roleKey);
  const enteredValueFieldName = Field[props.fields.value];
  const errorMessage = getRelevantErrorMessage(errorResults, [
    props.fields.value,
    props.fields.variable,
    props.fields.roleKey,
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
      <div role="radiogroup" aria-label={Field[props.fields.radio]}>
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
      {props.actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE &&
        props.actionValue.enteredValueType === EnterValueType.TEXT && (
          <FormControl
            type="text"
            value={props.actionValue.value}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={enteredValueIsInvalid()}
            name={enteredValueFieldName}
            role="textbox"
            aria-label={enteredValueFieldName}
          />
        )}
      {props.actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE &&
        props.actionValue.enteredValueType === EnterValueType.NUMERIC && (
          <FormControl
            type="number"
            value={props.actionValue.value}
            min={0}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={enteredValueIsInvalid()}
            name={enteredValueFieldName}
            role="input"
            aria-label={enteredValueFieldName}
          />
        )}
      {props.actionValue.actionValueType ===
        ActionValueType.Enum.USE_VARIABLE && (
        <VariablesDropdownComponent
          field={props.fields.variable}
          selectedVariableId={props.actionValue.variableId}
          onChange={(e) => variableIdChangedFn(e.target.value)}
          onBlur={(_e) => touchVariable()}
          isInvalid={variableSelectionIsInvalid()}
          variableTypeFilter={[props.actionValue.variableType]}
        />
      )}
      {props.actionValue.actionValueType ===
        ActionValueType.Enum.USE_ROLE_KEY && (
        <RoleKeyDropdownComponent
          roleKeyId={props.actionValue.roleKeyId}
          onChange={(e) => roleKeyIdChangedFn(e.target.value)}
          onBlur={(_e) => touchRoleKey()}
          isInvalid={roleKeySelectionIsInvalid()}
          field={props.fields.roleKey}
        />
      )}
    </FormGroupRowComponent>
  );
};
