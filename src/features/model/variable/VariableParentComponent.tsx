import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { wrapReduxMap } from '../../../data/wrap-redux-map';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { createTextVariable, Variable } from './data/variable';
import { variableDomainMapper } from './data/variable-domain-mapper';
import { VariableDTO } from './data/variable-dto';
import { VariableEditingContext } from './variable-editing-context';
import { variableReactReducer } from './variable-reducers';
import { VariableComponent } from './VariableComponent';

type VariableInitFunction = (specId: string | undefined) => Variable;

const getVariableInitFunction = (
  savedVariableMap: ReduxFriendlyStringMap<VariableDTO>,
  savedSelectorMap: ReduxFriendlyStringMap<SelectorDTO>
): VariableInitFunction => {
  return (variableId: string | undefined) => {
    if (variableId && savedVariableMap[variableId]) {
      const selectorFn = wrapReduxMap(savedSelectorMap);
      return variableDomainMapper.mapToDomain(
        savedVariableMap[variableId],
        selectorFn
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

  return (
    <ValidationComponent<Variable> validators={[]} editing={editing}>
      <VariableEditingContext.Provider
        value={{ localDispatchFn: localVariableDispatch }}
      >
        <VariableComponent variable={editing} />
      </VariableEditingContext.Provider>
    </ValidationComponent>
  );
};