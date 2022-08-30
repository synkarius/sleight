import React, { useContext } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { FormControl, FormText, Button, FormSelect } from 'react-bootstrap';
import { ChoiceVariableComponent } from './ChoiceVariableComponent';
import { VariableType } from './variable-types';
import { RangeVariableComponent } from './RangeVariableComponent';
import { saveEditingVariable } from './variable-reducers';
import { PanelComponent } from '../../ui/PanelComponent';
import { createSelector } from '../selector/data/selector-domain';
import { RoleKeyDropdownComponent } from '../role-key/RoleKeyDropdownComponent';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { Field } from '../../../validation/validation-field';
import {
  isChoiceVariable,
  isRangeVariable,
  isTextVariable,
  Variable,
} from './data/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';
import { ValidationContext } from '../../../validation/validation-context';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { saveSelector } from '../selector/selector-reducers';
import { LIST, LIST_ITEM } from '../common/accessibility-roles';
import { InjectionContext } from '../../../di/injector-context';
import { TextVariableComponent } from './TextVariableComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';

export const VariableComponent: React.FC<{ variable: Variable }> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const injectionContext = useContext(InjectionContext);
  const variableDefaultNamer = injectionContext.default.namers.variable;

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatchFn({
      type: VariableReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.VAR_NAME);
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
          const selectorDTO = injectionContext.mappers.selector.mapFromDomain(
            item.selector
          );
          reduxDispatch(saveSelector(selectorDTO));
        });
      }
      const variableDTO = injectionContext.mappers.variable.mapFromDomain(
        props.variable
      );
      reduxDispatch(saveEditingVariable(variableDTO));
      reduxDispatch(setEditorFocus());
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const nameError = errorResults([Field.VAR_NAME]);

  return (
    <PanelComponent header="Create/Edit Variable">
      <FormGroupRowComponent labelText="Name" errorMessage={nameError}>
        <FormControl
          aria-label={Field[Field.VAR_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.VAR_NAME)}
          isInvalid={!!nameError}
          value={props.variable.name}
          placeholder={variableDefaultNamer.getDefaultName(props.variable)}
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
      <FormGroupRowComponent
        labelText="Type"
        descriptionText="kind of variable"
        errorMessage={errorResults([Field.VAR_TYPE_SELECT])}
      >
        <FormSelect
          aria-label={Field[Field.VAR_TYPE_SELECT]}
          onChange={typeChangedHandler}
          onBlur={() => validationContext.touch(Field.VAR_TYPE_SELECT)}
          value={props.variable.type}
          role={LIST}
          isInvalid={!!errorResults([Field.VAR_TYPE_SELECT])}
        >
          {VariableType.values().map((vt) => (
            <option key={vt} value={vt} role={LIST_ITEM}>
              {vt}
            </option>
          ))}
        </FormSelect>
      </FormGroupRowComponent>
      {isTextVariable(props.variable) && (
        <TextVariableComponent text={props.variable} />
      )}
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
        disabled={fullErrorResults.length > 0}
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
