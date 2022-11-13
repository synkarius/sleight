import React, { useContext, useId } from 'react';
import { FormCheck, FormControl, FormSelect } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { VariablesDropdownComponent } from '../variable/VariablesDropdownComponent';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { ValidationContext } from '../../../validation/validation-context';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from './action-editing-context';
import { Field } from '../../../validation/validation-field';
import {
  EnumActionValue,
  isEnterEnumActionValue,
  isEnterNumberActionValue,
  isEnterTextActionValue,
  isEnterValueActionValue,
  isVariableActionValue,
  NumberActionValue,
  TextActionValue,
} from '../../../data/model/action/action-value';
import { UNSELECTED_ENUM } from '../../../core/common/consts';
import { processErrorResults } from '../../../validation/validation-result-processing';
import {
  ActionValueFieldGroup,
  isEnumActionFieldGroup,
  isNumberActionFieldGroup,
} from './action-value-type-name-group';
import { VariableType } from '../../../data/model/variable/variable-types';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
import { isDefined } from '../../../core/common/common-functions';
import {
  createAVCTypeChangePayload,
  createFieldedActionValueChange,
  createIdedActionValueChange,
} from './action-editing-context-support';
import { fieldName } from '../../../validation/field-name';

type AVCProps = {
  // value
  readonly actionValue: TextActionValue | NumberActionValue | EnumActionValue;
  readonly fields: ActionValueFieldGroup;
  // display
  readonly labelText: string;
  readonly descriptionText: string;
  readonly required?: boolean;
};

const getRadioButtonLabel = (
  actionValueType: ActionValueType.Type,
  variableType: VariableType.Type
) => {
  switch (actionValueType) {
    case ActionValueType.Enum.ENTER_VALUE:
      return 'Enter Value';
    case ActionValueType.Enum.USE_VARIABLE:
      return `Use (${variableType}) Variable`;
    default:
      throw new ExhaustivenessFailureError(actionValueType);
  }
};

const createRadioButtonDatum = (
  id: string,
  actionValueType: ActionValueType.Type
) => ({
  id,
  actionValueType,
});

export const ActionValueComponent: React.FC<AVCProps> = (props) => {
  /*
   * hooks
   */
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);
  const enterValueId = useId();
  const useVariableId = useId();

  /**
   * touch field functions
   */
  const touchEnteredValue = () => validationContext.touch(props.fields.value);
  const touchVariable = () => validationContext.touch(props.fields.variable);

  /**
   * event handlers
   */
  const typeChangedHandler = (type: string) => {
    const actionValueType = type as ActionValueType.Type;
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
      payload: createAVCTypeChangePayload(actionValueType, props.fields),
    });
    validationContext.touch(props.fields.radio);
  };
  const enteredValueChangedHandler = (value: string) => {
    const payload = isDefined(props.fields.id)
      ? createIdedActionValueChange(props.fields.id, value)
      : createFieldedActionValueChange(props.fields.radio, value);
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_ENTERED_VALUE,
      payload,
    });
    touchEnteredValue();
  };
  const variableIdChangedHandler = (variableId: string) => {
    const payload = isDefined(props.fields.id)
      ? createIdedActionValueChange(props.fields.id, variableId)
      : createFieldedActionValueChange(props.fields.radio, variableId);
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_ACTION_VALUE_VARIABLE_ID,
      payload,
    });
    touchVariable();
  };

  /**
   * Error processing
   */
  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const getIdForError = () => {
    if (isVariableActionValue(props.actionValue)) {
      if (props.fields.id) {
        return props.fields.id;
      }
      return props.actionValue.variableId;
    }
  };
  const idForError = getIdForError();

  /**
   * misc other form stuff
   */
  const enteredValueFieldName = fieldName(props.fields.value);
  const isChecked = (actionValueType: string): boolean =>
    props.actionValue.actionValueType === actionValueType;
  const radioButtonData = [
    createRadioButtonDatum(enterValueId, ActionValueType.Enum.ENTER_VALUE),
    createRadioButtonDatum(useVariableId, ActionValueType.Enum.USE_VARIABLE),
  ];

  return (
    <FormGroupRowComponent
      labelText={props.labelText}
      descriptionText={props.descriptionText}
      errorMessage={errorResults(
        [props.fields.value, props.fields.variable],
        idForError
      )}
      required={props.required}
    >
      <div role="radiogroup" aria-label={fieldName(props.fields.radio)}>
        {radioButtonData.map((d) => (
          <FormCheck
            inline
            label={getRadioButtonLabel(d.actionValueType, props.fields.type)}
            key={d.actionValueType}
            type="radio"
            role="radio"
            id={d.id}
            checked={isChecked(d.actionValueType)}
            aria-checked={isChecked(d.actionValueType)}
            tabIndex={isChecked(d.actionValueType) ? 0 : -1}
            onChange={(_e) => typeChangedHandler(d.actionValueType)}
          />
        ))}
      </div>
      {isEnterValueActionValue(props.actionValue) &&
        isEnterTextActionValue(props.actionValue) && (
          <FormControl
            type="text"
            value={props.actionValue.value}
            onChange={(e) => enteredValueChangedHandler(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults(props.fields.value)}
            name={enteredValueFieldName}
            role="textbox"
            aria-label={enteredValueFieldName}
          />
        )}
      {isEnterValueActionValue(props.actionValue) &&
        isEnterNumberActionValue(props.actionValue) &&
        isNumberActionFieldGroup(props.fields) && (
          <FormControl
            type="number"
            value={props.actionValue.value}
            min={props.fields.min}
            max={props.fields.max}
            onChange={(e) => enteredValueChangedHandler(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults(props.fields.value)}
            name={enteredValueFieldName}
            role="input"
            aria-label={enteredValueFieldName}
          />
        )}
      {isEnterValueActionValue(props.actionValue) &&
        isEnterEnumActionValue(props.actionValue) &&
        isEnumActionFieldGroup(props.fields) &&
        !!props.fields.enumValues.length && (
          <FormSelect
            value={props.actionValue.value}
            aria-label={fieldName(props.fields.value)}
            onChange={(e) => enteredValueChangedHandler(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults(props.fields.value)}
            role="list"
          >
            <option value={UNSELECTED_ENUM} role="listitem"></option>
            {props.fields.enumValues.map((enumValue) => (
              <option key={enumValue} value={enumValue} role="listitem">
                {enumValue}
              </option>
            ))}
          </FormSelect>
        )}
      {/* textbox enum value entry: */}
      {isEnterValueActionValue(props.actionValue) &&
        isEnterEnumActionValue(props.actionValue) &&
        isEnumActionFieldGroup(props.fields) &&
        !props.fields.enumValues.length && (
          <FormControl
            type="text"
            value={props.actionValue.value}
            onChange={(e) => enteredValueChangedHandler(e.target.value)}
            onBlur={(_e) => touchEnteredValue()}
            isInvalid={!!errorResults(props.fields.value)}
            name={enteredValueFieldName}
            role="textbox"
            aria-label={enteredValueFieldName}
          />
        )}
      {isVariableActionValue(props.actionValue) && (
        <VariablesDropdownComponent
          field={props.fields.variable}
          selectedVariableId={props.actionValue.variableId}
          onChange={(e) => variableIdChangedHandler(e.target.value)}
          onBlur={(_e) => touchVariable()}
          isInvalid={!!errorResults(props.fields.variable, idForError)}
          variableTypeFilter={[props.actionValue.variableType]}
        />
      )}
    </FormGroupRowComponent>
  );
};
