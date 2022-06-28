import { PayloadAction } from '@reduxjs/toolkit';
import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

// "EDC" = Extra Dropdown Component

// type of custom (generic) props
type EDCProps<T> = {
  payloadFn: (selectedVariableId: string) => PayloadAction<T>;
  variableTypeFilter: string[] | null;
  selectedVariableId: string;
};

// type of react component (it's a function which takes an EDCProps<T>-typed props)
type CustomGenericPropsComponent = <T>(
  props: EDCProps<T>
) => React.ReactElement<EDCProps<T>>;

export const ExtrasDropdownComponent: CustomGenericPropsComponent = (props) => {
  const dispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.extra.saved);

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
