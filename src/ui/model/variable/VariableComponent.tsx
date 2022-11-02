import React, { useContext } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { FormControl, FormText, Button, FormSelect } from 'react-bootstrap';
import { ChoiceVariableComponent } from './ChoiceVariableComponent';
import { VariableType } from '../../../data/model/variable/variable-types';
import { RangeVariableComponent } from './RangeVariableComponent';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import { PanelComponent } from '../../other-components/PanelComponent';
import { createSelector } from '../../../data/model/selector/selector-domain';
import { FormGroupRowComponent } from '../../other-components/FormGroupRowComponent';
import { Field } from '../../../validation/validation-field';
import {
  isChoiceVariable,
  isRangeVariable,
  isTextVariable,
  Variable,
} from '../../../data/model/variable/variable';
import {
  VariableEditingContext,
  VariableReducerActionType,
} from './variable-editing-context';
import { ValidationContext } from '../../../validation/validation-context';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import { LIST, LIST_ITEM } from '../../../core/common/accessibility-roles';
import { InjectionContext } from '../../../di/injector-context';
import { TextVariableComponent } from './TextVariableComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { useSaved } from '../../../app/custom-hooks/use-saved-hook';
import { ElementType } from '../../../data/model/element-types';
import { ExportImportOptionsComponent } from '../../other-components/ExportImportOptionsComponent';
import { Tokens } from '../../../di/config/brandi-tokens';

const VAR_ROLE_KEY = Field.VAR_ROLE_KEY;

export const VariableComponent: React.FC<{
  variable: Variable;
  closeFn: () => void;
}> = (props) => {
  const reduxDispatch = useAppDispatch();
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(VariableEditingContext);
  const container = useContext(InjectionContext);
  const isSaved = useSaved(ElementType.Enum.VARIABLE, props.variable.id);
  const variableDefaultNamer = container.get(Tokens.DefaultNamer_Variable);
  const selectorMapper = container.get(Tokens.DomainMapper_Selector);
  const variableMapper = container.get(Tokens.DomainMapper_Variable);

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_NAME,
      payload: event.target.value,
    });
    validationContext.touch(Field.VAR_NAME);
  };
  const roleKeyChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    editingContext.localDispatch({
      type: VariableReducerActionType.CHANGE_ROLE_KEY,
      payload: event.target.value,
    });
    validationContext.touch(Field.VAR_ROLE_KEY);
  };
  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariableType = event.target.value as VariableType.Type;
    switch (newVariableType) {
      case VariableType.Enum.ENUM:
        editingContext.localDispatch({
          type: VariableReducerActionType.CHANGE_TYPE,
          payload: {
            variableType: newVariableType,
            selector: createSelector(),
          },
        });
        break;
      default:
        editingContext.localDispatch({
          type: VariableReducerActionType.CHANGE_TYPE,
          payload: {
            variableType: newVariableType,
          },
        });
    }
    validationContext.touch(Field.VAR_TYPE_SELECT);
  };
  const toggleEnabled = () => {
    editingContext.localDispatch({
      type: VariableReducerActionType.TOGGLE_ENABLED,
    });
  };
  const toggleLocked = () => {
    editingContext.localDispatch({
      type: VariableReducerActionType.TOGGLE_LOCKED,
    });
  };
  const submitHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = validationContext.validateForSave();
    if (isValid) {
      // TODO: this still creates orphans... damnit... clear them
      // at least it's less this way
      if (props.variable.type === VariableType.Enum.ENUM) {
        props.variable.items.forEach((item) => {
          const selectorDTO = selectorMapper.mapFromDomain(item.selector);
          reduxDispatch(saveSelector(selectorDTO));
        });
      }
      const variableDTO = variableMapper.mapFromDomain(props.variable);
      reduxDispatch(saveVariable(variableDTO));
      props.closeFn();
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const nameError = errorResults([Field.VAR_NAME]);

  return (
    <PanelComponent header="Create/Edit Variable">
      <ExportImportOptionsComponent
        element={props.variable}
        toggleEnabledFn={toggleEnabled}
        toggleLockedFn={toggleLocked}
      />
      <FormGroupRowComponent labelText="Name" errorMessage={nameError}>
        <FormControl
          aria-label={Field[Field.VAR_NAME]}
          type="text"
          onChange={nameChangedHandler}
          onBlur={() => validationContext.touch(Field.VAR_NAME)}
          isInvalid={!!nameError}
          value={props.variable.name}
          placeholder={variableDefaultNamer.getName(props.variable)}
        />
        <FormText className="text-muted">name of variable</FormText>
      </FormGroupRowComponent>
      <FormGroupRowComponent
        labelText="Role Key"
        descriptionText="role of variable"
        errorMessage={errorResults([VAR_ROLE_KEY])}
      >
        <FormControl
          aria-label={Field[VAR_ROLE_KEY]}
          type="text"
          onChange={roleKeyChangedHandler}
          onBlur={() => validationContext.touch(VAR_ROLE_KEY)}
          isInvalid={!!errorResults([VAR_ROLE_KEY])}
          value={props.variable.roleKey}
        />
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
      {isSaved && (
        <Button
          onClick={() => editingContext.deleteModalConfig.setShow(true)}
          variant="danger"
          size="lg"
          className="me-3"
          aria-label={Field[Field.VAR_DELETE]}
        >
          Delete
        </Button>
      )}
      <Button
        onClick={props.closeFn}
        className="me-3"
        variant="warning"
        size="lg"
      >
        Cancel
      </Button>
      <Button
        onClick={submitHandler}
        variant="primary"
        size="lg"
        disabled={fullErrorResults.length > 0}
      >
        Save
      </Button>
    </PanelComponent>
  );
};
