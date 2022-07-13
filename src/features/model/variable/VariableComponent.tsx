import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { FormControl, FormText, Button, FormSelect } from 'react-bootstrap';
import { ChoiceComponent } from './choice/ChoiceComponent';
import { Variable } from './variable';
import { Range } from './range/range';
import { Choice } from './choice/choice';
import { VariableType } from './variable-types';
import { RangeComponent } from './range/RangeComponent';
import {
  changeEditingVariableName,
  changeEditingVariableType,
  saveEditingVariable,
  clearEditingVariable,
  changeEditingVariableRoleKey,
} from './variable-reducers';
import { PanelComponent } from '../../ui/PanelComponent';
import { createSelector } from '../selector/selector';
import { createNewSelector } from '../selector/selector-reducers';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';

export const VariableComponent: React.FC<{ variable: Variable }> = (props) => {
  const dispatch = useAppDispatch();

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeEditingVariableName(event.target.value));
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariableType = event.target.value;
    let selectorId: string | null = null;
    if (newVariableType === VariableType.CHOICE) {
      const selector = createSelector();
      selectorId = selector.id;
      dispatch(createNewSelector(selector));
    }
    dispatch(
      changeEditingVariableType({
        variableType: newVariableType,
        selectorId: selectorId,
      })
    );
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveEditingVariable());
    dispatch(clearEditingVariable());
  };

  return (
    <PanelComponent header="Create/Edit Variable">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          type="text"
          onChange={nameChangedHandler}
          value={props.variable.name}
        />
        <FormText className="text-muted">name of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          roleKeyId={props.variable.roleKeyId}
          onChange={(e) =>
            dispatch(changeEditingVariableRoleKey(e.target.value))
          }
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label="Variable type selection"
          onChange={typeChangedHandler}
          value={props.variable.type}
        >
          {VariableType.values().map((vt) => (
            <option key={vt} value={vt}>
              {vt}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of variable</FormText>
      </FormGroupRowComponent>
      {props.variable.type === VariableType.RANGE && (
        <RangeComponent range={props.variable as Range} />
      )}
      {props.variable.type === VariableType.CHOICE && (
        <ChoiceComponent choice={props.variable as Choice} />
      )}
      <Button onClick={submitHandler} variant="primary" size="lg">
        Save
      </Button>
      <Button
        onClick={(_e) => dispatch(clearEditingVariable())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
