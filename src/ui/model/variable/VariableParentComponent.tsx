import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { createTextVariable, Variable } from './data/variable';
import { VariableDomainMapper } from './data/variable-domain-mapper';
import { VariableDTO } from './data/variable-dto';
import { VariableEditingContext } from './variable-editing-context';
import { deleteVariable, variableReactReducer } from './variable-reducers';
import { VariableComponent } from './VariableComponent';
import { Field } from '../../../validation/validation-field';

type VariableInitFunction = (specId?: string) => Variable;

const getVariableInitFunction = (
  savedVariableMap: Record<string, VariableDTO>,
  savedSelectorMap: Record<string, SelectorDTO>,
  variableDomainMapper: VariableDomainMapper
): VariableInitFunction => {
  return (variableId?: string) => {
    if (variableId && savedVariableMap[variableId]) {
      return variableDomainMapper.mapToDomain(
        savedVariableMap[variableId],
        savedSelectorMap
      );
    }
    return createTextVariable();
  };
};

export const VariableParentComponent: React.FC<{ variableId?: string }> = (
  props
) => {
  const reduxDispatch = useAppDispatch();
  const variables = useAppSelector((state) => state.variable.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const injectionContext = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    variableReactReducer,
    props.variableId,
    getVariableInitFunction(
      variables,
      selectors,
      injectionContext.mappers.variable
    )
  );
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteVariable(editing.id));
    reduxDispatch(setEditorFocus());
  };
  const deleteModalConfig = { show, setShow };

  return (
    <ValidationComponent<Variable>
      validators={[...injectionContext.validators.variable]}
      editing={editing}
    >
      <VariableEditingContext.Provider
        value={{ localDispatch, deleteModalConfig }}
      >
        <VariableComponent variable={editing} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.VAR_DELETE_MODAL_DELETE}
          cancelField={Field.VAR_DELETE_MODAL_CANCEL}
        />
      </VariableEditingContext.Provider>
    </ValidationComponent>
  );
};
