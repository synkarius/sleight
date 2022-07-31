import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { LIST, LIST_ITEM } from '../common/accessibility-roles';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { VariableType } from './variable-types';

type VariablesDropdownComponentProps = {
  selectedVariableId?: string;
  variableTypeFilter?: VariableType.Type[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
  name?: string;
};

export const VariablesDropdownComponent: React.FC<
  VariablesDropdownComponentProps
> = (props) => {
  const variablesSaved = useAppSelector((state) => state.variable.saved);
  const variableId = props.selectedVariableId ?? SELECT_DEFAULT_VALUE;

  return (
    <FormSelect
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={variableId}
      isInvalid={props.isInvalid}
      role={LIST}
      aria-label={props.name}
    >
      <option value={SELECT_DEFAULT_VALUE} role={LIST_ITEM}></option>
      {Object.values(variablesSaved)
        .filter(
          (variable) =>
            !props.variableTypeFilter ||
            props.variableTypeFilter.includes(variable.type)
        )
        .map((variable) => (
          <option key={variable.id} value={variable.id} role={LIST_ITEM}>
            {variable.name}
          </option>
        ))}
    </FormSelect>
  );
};
