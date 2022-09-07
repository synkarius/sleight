import React, { useContext, useId } from 'react';
import { FormCheck, FormControl, FormSelect } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../other-components/FormGroupRowComponent';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { ActionValueType } from '../../../../data/model/action/action-value/action-value-type';
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
  isVariableActionValue,
  NumericActionValue,
  TextActionValue,
} from '../../../../data/model/action/action-value/action-value';
import { SELECT_DEFAULT_VALUE } from '../../../../core/common/consts';
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
  const enterValueId = useId();
  const useVariableId = useId();

  const typeChangedFn = (type: string) => {
    editingContext.localDispatch({
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
    editingContext.localDispatch({
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
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload: {
        field: props.fields.variable,
        value: id,
      },
    });
    touchVariable();
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const enteredValueFieldName = Field[props.fields.value];
  const isChecked = (actionValueType: string): boolean =>
    props.actionValue.actionValueType === actionValueType;
  const variableId = isVariableActionValue(props.actionValue)
    ? props.actionValue.variableId
    : undefined;
  const radioButtonData = [
    { id: enterValueId, actionValueType: ActionValueType.Enum.ENTER_VALUE },
    { id: useVariableId, actionValueType: ActionValueType.Enum.USE_VARIABLE },
  ];

  return (
    <FormGroupRowComponent
      labelText={props.labelText}
      descriptionText={props.descriptionText}
      errorMessage={errorResults(
        [props.fields.value, props.fields.variable],
        variableId
      )}
      required={props.required}
    >
      <div role="radiogroup" aria-label={Field[props.fields.radio]}>
        {radioButtonData.map((d) => (
          <FormCheck
            inline
            label={d.actionValueType}
            key={d.actionValueType}
            type="radio"
            role="radio"
            id={d.id}
            checked={isChecked(d.actionValueType)}
            aria-checked={isChecked(d.actionValueType)}
            tabIndex={isChecked(d.actionValueType) ? 0 : -1}
            onChange={(_e) => typeChangedFn(d.actionValueType)}
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
    </FormGroupRowComponent>
  );
};
