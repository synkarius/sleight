import { FormSelect } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Field } from '../../../validation/validation-field';
import { LIST, LIST_ITEM } from '../../../core/common/accessibility-roles';
import { UNSELECTED_ID } from '../../../core/common/consts';
import { VariableType } from '../../../data/model/variable/variable-types';

type VariablesDropdownComponentProps = {
  field: Field;
  selectedVariableId?: string;
  variableTypeFilter?: VariableType.Type[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  isInvalid?: boolean;
};

export const VariablesDropdownComponent: React.FC<
  VariablesDropdownComponentProps
> = (props) => {
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  return (
    <FormSelect
      value={props.selectedVariableId ?? UNSELECTED_ID}
      aria-label={Field[props.field]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      isInvalid={props.isInvalid}
      role={LIST}
    >
      <option value={UNSELECTED_ID} role={LIST_ITEM}></option>
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
