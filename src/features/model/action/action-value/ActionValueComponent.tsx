import React from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import { FormCheck, FormControl } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariableType } from '../../variable/variable-types';
import { VariablesDropdownComponent } from '../../variable/VariablesDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import {
  ChangeActionValuePayload,
  ChoiceValue,
  RangeValue,
  TextValue,
} from './action-value';
import { ActionValueType } from './action-value-type';
import {
  getRelevantErrorMessage,
  Validator,
} from '../../../../validation/validator';
import { IdValued, TextValued } from '../action-validation';
import { ActionValueOperation } from './action-value-operation';

// type of custom (generic) props
type AVCProps<T> = {
  // value
  actionValue: TextValue | RangeValue | ChoiceValue;
  // display
  labelText: string;
  descriptionText: string;
  // redux action creators
  changeFn: (
    eventTargetValue: string,
    operation: ActionValueOperation
  ) => PayloadAction<ChangeActionValuePayload<T>>;
  //
  resetFn: () => PayloadAction<undefined>;
  validationFn?: () => PayloadAction<undefined>;
  // validators
  enterValueValidator?: Validator<TextValued>;
  variableValidator?: Validator<IdValued>;
  roleKeyValidator?: Validator<IdValued>;
};

// type of react component
type CustomGenericPropsComponent = <T>(
  props: AVCProps<T>
) => React.ReactElement<AVCProps<T>>;

export const ActionValueComponent: CustomGenericPropsComponent = (props) => {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(
    (state) => state.action.validationErrors
  );

  const validateActionValue = () => {
    props.validationFn && dispatch(props.validationFn());
  };
  const typeChangedFn = (type: string) => {
    dispatch(props.changeFn(type, ActionValueOperation.CHANGE_TYPE));
    dispatch(props.resetFn());
  };
  const enteredValueChangedFn = (value: string) => {
    dispatch(props.changeFn(value, ActionValueOperation.CHANGE_ENTERED_VALUE));
    validateActionValue();
  };
  const variableIdChangedFn = (id: string) => {
    dispatch(props.changeFn(id, ActionValueOperation.CHANGE_VARIABLE_ID));
    validateActionValue();
  };
  const roleKeyIdChangedFn = (id: string) => {
    dispatch(props.changeFn(id, ActionValueOperation.CHANGE_ROLE_KEY_ID));
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
  const validators = [
    props.enterValueValidator,
    props.variableValidator,
    props.roleKeyValidator,
  ];
  const errorMessage = getRelevantErrorMessage(validationErrors, validators);

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
