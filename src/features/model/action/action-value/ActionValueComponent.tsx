import React, { useContext } from 'react';
import { FormCheck, FormControl, FormSelect } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import { ActionValueType } from './action-value-type';
import { ValidationContext } from '../../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { Field } from '../../../../validation/validation-field';
import {
  EnumActionValue,
  isEnterEnumActionValue,
  isEnterNumberActionValue,
  isEnterTextActionValue,
  isEnterValueActionValue,
  isRoleKeyActionValue,
  isVariableActionValue,
  NumericActionValue,
  TextActionValue,
} from './action-value';
import { SELECT_DEFAULT_VALUE } from '../../common/consts';
import { processErrorResults } from '../../../../validation/validation-result-processing';
import { ActionValueFieldGroup } from './action-value-type-name-group';

type EnumActionValueWithEnumValues = EnumActionValue & {
  readonly enumValues: string[];
};

type AVCProps = {
  // value
  readonly actionValue:
    | TextActionValue
    | NumericActionValue
    | EnumActionValueWithEnumValues;
  readonly fields: ActionValueFieldGroup;
  // display
  readonly labelText: string;
  readonly descriptionText: string;
  readonly required?: boolean;
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

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const enteredValueFieldName = Field[props.fields.value];
  const isChecked = (actionValueType: string): boolean =>
    props.actionValue.actionValueType === actionValueType;
  const variableId = isVariableActionValue(props.actionValue)
    ? props.actionValue.variableId
    : undefined;

  return (
    <FormGroupRowComponent
      labelText={props.labelText}
      descriptionText={props.descriptionText}
      errorMessage={errorResults(
        [props.fields.value, props.fields.variable, props.fields.roleKey],
        variableId
      )}
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
      {isEnterValueActionValue(props.actionValue) &&
        isEnterTextActionValue(props.actionValue) && (
          <FormControl
            type="text"
            value={props.actionValue.value}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults([props.fields.value])}
            name={enteredValueFieldName}
            role="textbox"
            aria-label={enteredValueFieldName}
          />
        )}
      {isEnterValueActionValue(props.actionValue) &&
        isEnterNumberActionValue(props.actionValue) && (
          <FormControl
            type="number"
            value={props.actionValue.value}
            min={0}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults([props.fields.value])}
            name={enteredValueFieldName}
            role="input"
            aria-label={enteredValueFieldName}
          />
        )}
      {isEnterValueActionValue(props.actionValue) &&
        isEnterEnumActionValue(props.actionValue) && (
          <FormSelect
            value={props.actionValue.value}
            aria-label={Field[props.fields.value]}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults([props.fields.value])}
            role="list"
          >
            <option value={SELECT_DEFAULT_VALUE} role="listitem"></option>
            {props.actionValue.enumValues.map((enumValue) => (
              <option key={enumValue} value={enumValue} role="listitem">
                {enumValue}
              </option>
            ))}
          </FormSelect>
        )}
      {isVariableActionValue(props.actionValue) && (
        <VariablesDropdownComponent
          field={props.fields.variable}
          selectedVariableId={props.actionValue.variableId}
          onChange={(e) => variableIdChangedFn(e.target.value)}
          onBlur={(_e) => touchVariable()}
          isInvalid={
            !!errorResults(
              [props.fields.variable],
              props.actionValue.variableId
            )
          }
          variableTypeFilter={[props.actionValue.variableType]}
        />
      )}
      {isRoleKeyActionValue(props.actionValue) && (
        <RoleKeyDropdownComponent
          roleKeyId={props.actionValue.roleKeyId}
          onChange={(e) => roleKeyIdChangedFn(e.target.value)}
          onBlur={(_e) => touchRoleKey()}
          isInvalid={!!errorResults([props.fields.roleKey])}
          field={props.fields.roleKey}
        />
      )}
    </FormGroupRowComponent>
  );
};
