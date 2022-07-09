import { PayloadAction } from '@reduxjs/toolkit';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

// "VDC" = Variable Dropdown Component

// type of custom (generic) props
type VDCProps<T> = {
  payloadFn: (selectedVariableId: string) => PayloadAction<T>;
  variableTypeFilter: string[] | null;
  selectedVariableId: string;
};

// type of react component (it's a function which takes an EDCProps<T>-typed props)
type CustomGenericPropsComponent = <T>(
  props: VDCProps<T>
) => React.ReactElement<VDCProps<T>>;

export const VariablesDropdownComponent: CustomGenericPropsComponent = (
  props
) => {
  const dispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.variable.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(props.payloadFn(event.target.value));
  };

  return (
    <FormSelect
      aria-label="spec item variable selection"
      onChange={selectedChangedHandler}
      value={props.selectedVariableId}
    >
      <option value={SELECT_DEFAULT_VALUE}></option>
      {Object.values(variables)
        .filter(
          (variable) =>
            !props.variableTypeFilter ||
            props.variableTypeFilter.includes(variable.type)
        )
        .map((variable) => (
          <option key={variable.id} value={variable.id}>
            {variable.name}
          </option>
        ))}
    </FormSelect>
  );
};
