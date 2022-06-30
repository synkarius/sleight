import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { FormControl } from 'react-bootstrap';
import { useAppDispatch } from '../../../../app/hooks';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariableType } from '../../extra/extra-types';
import { ExtrasDropdownComponent } from '../../extra/ExtrasDropdownComponent';
import { RoleKeyDropdownComponent } from '../../role-key/RoleKeyDropdownComponent';
import { ChoiceValue, RangeValue, TextValue } from './action-value';
import { ActionValueType } from './action-value-type';
import { ActionValueTypeRadioGroupComponent } from './ActionValueTypeRadioGroupComponent';

type AVCProps = {
  labelText: string;
  actionValue: TextValue | RangeValue | ChoiceValue;
  actionValueTypeChangedFn: (
    newActionValueType: string
  ) => PayloadAction<string>;
  valueChangedFn: (newValue: string) => PayloadAction<string>;
  variableIdChangedFn: (selectedVariableId: string) => PayloadAction<string>;
  roleKeyIdChangedFn: (selectedRoleKeyId: string) => PayloadAction<string>;
};

export const ActionValueComponent: React.FC<AVCProps> = (props) => {
  const dispatch = useAppDispatch();

  const enterNumericValue = (
    <FormControl
      type="number"
      min={0}
      onChange={(e) => dispatch(props.valueChangedFn(e.target.value))}
      value={props.actionValue.value as number}
    />
  );
  const enterTextValue = (
    <FormControl
      type="text"
      onChange={(e) => dispatch(props.valueChangedFn(e.target.value))}
      value={props.actionValue.value as number}
    />
  );
  const enterValue =
    props.actionValue.variableType == VariableType.RANGE
      ? enterNumericValue
      : enterTextValue;

  return (
    <FormGroupRowComponent labelText={props.labelText}>
      <ActionValueTypeRadioGroupComponent
        actionValue={props.actionValue}
        radioGroupName={props.labelText}
        typeChangedFn={props.actionValueTypeChangedFn}
      />
      {props.actionValue.actionValueType === ActionValueType.ENTER_VALUE &&
        enterValue}
      {props.actionValue.actionValueType === ActionValueType.USE_VARIABLE && (
        <ExtrasDropdownComponent<string>
          selectedVariableId={props.actionValue.variableId as string}
          payloadFn={props.variableIdChangedFn}
          variableTypeFilter={[props.actionValue.variableType]}
        />
      )}
      {props.actionValue.actionValueType === ActionValueType.USE_ROLE_KEY && (
        <RoleKeyDropdownComponent
          roleKeyId={props.actionValue.roleKeyId}
          payloadFn={props.roleKeyIdChangedFn}
        />
      )}
    </FormGroupRowComponent>
  );
};
