import React, { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { createTextVariable, Variable } from './data/variable';
import { variableDomainMapper } from './data/variable-domain-mapper';
import { VariableDTO } from './data/variable-dto';
import { VariableEditingContext } from './variable-editing-context';
import { variableReactReducer } from './variable-reducers';
import {
  atLeastOneChoiceItem,
  choiceSelectorItemsCantBeEmpty,
  rangeMaxIsGreaterThanOrEqualsRangeMin,
} from './variable-validators';
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

  return (
    <ValidationComponent<Variable>
      validators={[
        rangeMaxIsGreaterThanOrEqualsRangeMin,
        atLeastOneChoiceItem,
        choiceSelectorItemsCantBeEmpty,
      ]}
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
