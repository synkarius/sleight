import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { SELECT_DEFAULT_VALUE } from '../common/consts';

type VariablesDropdownComponentProps = {
  selectedVariableId: string;
  variableTypeFilter?: string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
  name?: string;
};

export const VariablesDropdownComponent: React.FC<
  VariablesDropdownComponentProps
> = (props) => {
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  return (
    <FormSelect
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.selectedVariableId}
      isInvalid={props.isInvalid}
      role="list"
      aria-label={props.name}
    >
      <option value={SELECT_DEFAULT_VALUE} role="listitem"></option>
      {Object.values(variablesSaved)
        .filter(
          (variable) =>
            !props.variableTypeFilter ||
            props.variableTypeFilter.includes(variable.type)
        )
        .map((variable) => (
          <option key={variable.id} value={variable.id} role="listitem">
            {variable.name}
          </option>
        ))}
    </FormSelect>
  );
};
