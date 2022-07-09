import { PayloadAction } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { FormCheck, FormControl } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariableType } from '../../variable/variable-types';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import { ChoiceValue, RangeValue, TextValue } from './action-value';
import { ActionValueType } from './action-value-type';
import {
  getRelevantErrorMessage,
  Validator,
} from '../../../../validation/validator';
import { IdValued, TextValued } from '../action-validation';

type AVCProps = {
  // value
  actionValue: TextValue | RangeValue | ChoiceValue;
  // display
  labelText: string;
  descriptionText: string;
  // redux action creators
  actionValueTypeChangedFn: (newType: string) => PayloadAction<string>;
  valueChangedFn: (newValue: string) => PayloadAction<string>;
  variableIdChangedFn: (selectedVariableId: string) => PayloadAction<string>;
  roleKeyIdChangedFn: (selectedRoleKeyId: string) => PayloadAction<string>;
  validationFn?: () => PayloadAction<undefined>;
  // validators
  enterValueValidator?: Validator<TextValued>;
  variableValidator?: Validator<IdValued>;
  roleKeyValidator?: Validator<IdValued>;
};

export const ActionValueComponent: React.FC<AVCProps> = (props) => {
  const dispatch = useAppDispatch();
  const [valueWasTouched, setValueWasTouched] = useState(false);
  const [variableWasTouched, setVariableWasTouched] = useState(false);
  const [roleKeyWasTouched, setRoleKeyWasTouched] = useState(false);
  const validationErrors = useAppSelector(
    (state) => state.action.validationErrors
  );

  const validateActionValue = () => {
    props.validationFn && dispatch(props.validationFn());
  };
  const typeChangedFn = (type: string) => {
    dispatch(props.actionValueTypeChangedFn(type));
    const shouldValidate =
      (valueWasTouched && type === ActionValueType.ENTER_VALUE) ||
      (variableWasTouched && type === ActionValueType.USE_VARIABLE) ||
      (roleKeyWasTouched && type === ActionValueType.USE_ROLE_KEY);
    shouldValidate && validateActionValue();
  };
  const enteredValueChangedFn = (value: string) => {
    setValueWasTouched(true);
    dispatch(props.valueChangedFn(value));
    validateActionValue();
  };
  const variableIdChangedFn = (id: string) => {
    setVariableWasTouched(true);
    dispatch(props.variableIdChangedFn(id));
    validateActionValue();
  };
  const roleKeyIdChangedFn = (id: string) => {
    setRoleKeyWasTouched(true);
    dispatch(props.roleKeyIdChangedFn(id));
    validateActionValue();
  };
  const enteredValueIsInvalid = !!(
    props.enterValueValidator &&
    validationErrors.includes(props.enterValueValidator.error)
  );
  const variableSelectionIsInvalid = !!(
    props.variableValidator &&
    validationErrors.includes(props.variableValidator.error)
  );
  const roleKeySelectionIsInvalid = !!(
    props.roleKeyValidator &&
    validationErrors.includes(props.roleKeyValidator.error)
  );
  const variableTypeIsNumeric =
    props.actionValue.variableType === VariableType.RANGE;
  const errorMessage = getRelevantErrorMessage(validationErrors, [
    props.enterValueValidator,
    props.variableValidator,
    props.roleKeyValidator,
  ]);

  return (
    <FormGroupRowComponent
      labelText={props.labelText}
      descriptionText={props.descriptionText}
      errorMessage={errorMessage}
    >
      <div className="action-value-component-radio">
        {ActionValueType.values().map((actionValueType) => (
          <FormCheck
            inline
            label={actionValueType}
            name={props.labelText + ' radio group'}
            type="radio"
            key={actionValueType}
            checked={props.actionValue.actionValueType === actionValueType}
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
            onBlur={(_e) => validateActionValue()}
            isInvalid={enteredValueIsInvalid}
          />
        )}
      {props.actionValue.actionValueType === ActionValueType.ENTER_VALUE &&
        variableTypeIsNumeric && (
          <FormControl
            type="number"
            value={props.actionValue.value as number}
            min={0}
            onChange={(e) => enteredValueChangedFn(e.target.value)}
            onBlur={(_e) => validateActionValue()}
            isInvalid={enteredValueIsInvalid}
          />
        )}
      {props.actionValue.actionValueType === ActionValueType.USE_VARIABLE && (
        <VariablesDropdownComponent
          selectedVariableId={props.actionValue.variableId as string}
          onChange={(e) => variableIdChangedFn(e.target.value)}
          onBlur={(_e) => validateActionValue()}
          isInvalid={variableSelectionIsInvalid}
          variableTypeFilter={[props.actionValue.variableType]}
        />
      )}
      {props.actionValue.actionValueType === ActionValueType.USE_ROLE_KEY && (
        <RoleKeyDropdownComponent
          roleKeyId={props.actionValue.roleKeyId}
          onChange={(e) => roleKeyIdChangedFn(e.target.value)}
          onBlur={(_e) => validateActionValue()}
          isInvalid={roleKeySelectionIsInvalid}
        />
      )}
    </FormGroupRowComponent>
  );
};
