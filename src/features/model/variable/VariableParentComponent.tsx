import React, { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { InjectionContext } from '../../../di/injector-context';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { createTextVariable, Variable } from './data/variable';
import { variableDomainMapper } from './data/variable-domain-mapper';
import { VariableDTO } from './data/variable-dto';
import { VariableEditingContext } from './variable-editing-context';
import { variableReactReducer } from './variable-reducers';
import { VariableComponent } from './VariableComponent';

type VariableInitFunction = (specId?: string) => Variable;

const getVariableInitFunction = (
  savedVariableMap: Record<string, VariableDTO>,
  savedSelectorMap: Record<string, SelectorDTO>
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
  const variables = useAppSelector((state) => state.variable.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const [editing, localVariableDispatch] = useReducer(
    variableReactReducer,
    props.variableId,
    getVariableInitFunction(variables, selectors)
  );
  const injectionContext = useContext(InjectionContext);

  return (
    <ValidationComponent<Variable>
      validators={[...injectionContext.validators.variable]}
      editing={editing}
    >
      <VariableEditingContext.Provider
        value={{ localDispatchFn: localVariableDispatch }}
      >
        <VariableComponent variable={editing} />
      </VariableEditingContext.Provider>
    </ValidationComponent>
  );
};
