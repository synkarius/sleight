import React, { useContext } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { FormControl, FormText, Button, FormSelect } from 'react-bootstrap';
import { ChoiceVariableComponent } from './ChoiceVariableComponent';
import { VariableType } from './variable-types';
import { RangeVariableComponent } from './RangeVariableComponent';
import { saveEditingVariable } from './variable-reducers';
import { PanelComponent } from '../../ui/PanelComponent';
import { createSelector, Selector } from '../selector/data/selector-domain';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { Field } from '../../../validation/validation-field';
import { isChoiceVariable, isRangeVariable, Variable } from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';
import { ValidationContext } from '../../../validation/validation-context';
import { variableDomainMapper } from './data/variable-domain-mapper';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { selectorDomainMapper } from '../selector/data/selector-domain-mapper';
import { saveSelector } from '../selector/selector-reducers';
import { LIST, LIST_ITEM } from '../common/accessibility-roles';

export const VariableComponent: React.FC<{ variable: Variable }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariableType = event.target.value as VariableType.Type;
    switch (newVariableType) {
      case VariableType.Enum.CHOICE:
        editingContext.localDispatchFn({
          type: VariableReducerActionType.CHANGE_TYPE,
          payload: {
            variableType: newVariableType,
            selector: createSelector(),
          },
        });
        break;
      default:
        editingContext.localDispatchFn({
          type: VariableReducerActionType.CHANGE_TYPE,
          payload: {
            variableType: newVariableType,
          },
        });
    }
    validationContext.touch(Field.VAR_TYPE_SELECT);
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForm();
    if (isValid) {
      // TODO: this still creates orphans... damnit... clear them
      // at least it's less this way
      if (props.variable.type === VariableType.Enum.CHOICE) {
        props.variable.items.forEach((item) => {
          const selectorDTO = selectorDomainMapper.mapFromDomain(item.selector);
          reduxDispatch(saveSelector(selectorDTO));
        });
      }
      const variableDTO = variableDomainMapper.mapFromDomain(props.variable);
      reduxDispatch(saveEditingVariable(variableDTO));
      reduxDispatch(setEditorFocus());
    }
  };
  const errorResults = validationContext.getErrorResults();

  return (
    <PanelComponent header="Create/Edit Variable">
      <FormGroupRowComponent labelText="Name">
        <FormControl
          aria-label={Field[Field.VAR_NAME]}
          type="text"
          onChange={nameChangedHandler}
          value={props.variable.name}
        />
        <FormText className="text-muted">name of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Role Key">
        <RoleKeyDropdownComponent
          field={Field.VAR_ROLE_KEY}
          roleKeyId={props.variable.roleKeyId}
          onChange={roleKeyChangedHandler}
        />
        <FormText className="text-muted">role of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent labelText="Type">
        <FormSelect
          aria-label={Field[Field.VAR_TYPE_SELECT]}
          onChange={typeChangedHandler}
          value={props.variable.type}
          role={LIST}
        >
          {VariableType.values().map((vt) => (
            <option key={vt} value={vt} role={LIST_ITEM}>
              {vt}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of variable</FormText>
      </FormGroupRowComponent>
      {isRangeVariable(props.variable) && (
        <RangeVariableComponent range={props.variable} />
      )}
      {isChoiceVariable(props.variable) && (
        <ChoiceVariableComponent choice={props.variable} />
      )}
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={errorResults.length > 0}
      >
        Save
      </Button>
      <Button
        onClick={(_e) => reduxDispatch(setEditorFocus())}
        className="mx-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
    </PanelComponent>
  );
};
