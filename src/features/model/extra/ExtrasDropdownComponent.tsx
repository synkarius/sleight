import { FormSelect } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { changeSpecItemVariableId } from '../spec/spec-reducers';

export const ExtrasDropdownComponent: React.FC<{
  specItemId: string;
  selectedVariableId: string;
}> = (props) => {
  const dispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.extra.saved);

  const selectedChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(
      changeSpecItemVariableId({
        specItemId: props.specItemId,
        variableId: event.target.value,
      })
    );
  };

  return (
    <FormSelect
      aria-label="Spec item variable selection"
      onChange={selectedChangedHandler}
      value={props.selectedVariableId}
    >
      {Object.values(variables).map((variable) => (
        <option key={variable.id} value={variable.id}>
          {variable.name}
        </option>
      ))}
    </FormSelect>
  );
};
