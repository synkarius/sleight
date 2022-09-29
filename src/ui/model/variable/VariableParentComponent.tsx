import React, { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import {
  createTextVariable,
  Variable,
} from '../../../data/model/variable/variable';
import { VariableDomainMapper } from '../../../core/mappers/variable-domain-mapper';
import { VariableDTO } from '../../../data/model/variable/variable-dto';
import { VariableEditingContext } from './variable-editing-context';
import {
  deleteVariable,
  variableReactReducer,
} from '../../../core/reducers/variable-reducers';
import { VariableComponent } from './VariableComponent';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { useNavigate } from 'react-router-dom';
import { EMPTY_PATH } from '../../../core/common/consts';

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
  const navigate = useNavigate();
  const variables = useAppSelector((state) => state.variable.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    variableReactReducer,
    props.variableId,
    getVariableInitFunction(
      variables,
      selectors,
      container.get(Tokens.DomainMapper_Variable)
    )
  );
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteVariable(editing.id));
    navigate(EMPTY_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Variable);

  return (
    <ValidationComponent<Variable> validators={validators} editing={editing}>
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
