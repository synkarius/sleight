import { PayloadAction } from '@reduxjs/toolkit';
import React, { useId } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { FormGroupRowComponent } from '../../../ui/FormGroupRowComponent';
import { VariableType } from '../../extra/extra-types';
import { ExtrasDropdownComponent } from '../../extra/ExtrasDropdownComponent';
import { RangeValue } from './action-value';

export const RangeValueComponent: React.FC<{
  labelText: string;
  rangeValue: RangeValue;
  idedChangedFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  valueChangedFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variableIdChangedFn: (selectedVariableId: string) => PayloadAction<string>;
}> = (props) => {
  const id = useId();
  // checkbox: toggles use-variable
  return (
    <FormGroupRowComponent labelText={props.labelText}>
      <Form.Check
        type="switch"
        id={id}
        label="Use Variable"
        checked={props.rangeValue.ided}
        onChange={props.idedChangedFn}
      />
      {!props.rangeValue.ided && (
        <FormControl
          type="number"
          min={0}
          onChange={props.valueChangedFn}
          value={props.rangeValue.value as number}
        />
      )}
      {props.rangeValue.ided && (
        <ExtrasDropdownComponent<string>
          selectedVariableId={props.rangeValue.rangeVariableId as string}
          payloadFn={props.variableIdChangedFn}
          variableTypeFilter={[VariableType.RANGE]}
        />
      )}
    </FormGroupRowComponent>
  );
};
