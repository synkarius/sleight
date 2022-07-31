import { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createSpec, Spec } from './data/spec-domain';
import { specDomainMapper } from './data/spec-domain-mapper';
import { SpecRedux } from './data/spec-redux';
import { SpecEditingContext } from './spec-editing-context';
import { specReactReducer } from './spec-reducers';
import { SpecComponent } from './SpecComponent';
import { SelectorRedux } from '../selector/data/selector-redux';
import { wrapReduxMap } from '../../../data/wrap-redux-map';
import {
  atLeastOneSpecItem,
  specSelectorItemsCantBeEmpty,
} from './spec-validators';

type SpecInitFunction = (specId: string | undefined) => Spec;

const getSpecInitFunction = (
  savedSpecMap: ReduxFriendlyStringMap<SpecRedux>,
  savedSelectorMap: ReduxFriendlyStringMap<SelectorRedux>
): SpecInitFunction => {
  return (specId: string | undefined) => {
    if (specId && savedSpecMap[specId]) {
      const selectorFn = wrapReduxMap(savedSelectorMap);
      return specDomainMapper.mapToDomain(savedSpecMap[specId], selectorFn);
    }
    return createSpec();
  };
};

export const SpecParentComponent: React.FC<{ specId?: string }> = (props) => {
  const specs = useAppSelector((state) => state.spec.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const [editing, localSpecDispatch] = useReducer(
    specReactReducer,
    props.specId,
    getSpecInitFunction(specs, selectors)
  );

  return (
    <ValidationComponent<Spec>
      validators={[atLeastOneSpecItem, specSelectorItemsCantBeEmpty]}
      editing={editing}
    >
      <SpecEditingContext.Provider
        value={{ localDispatchFn: localSpecDispatch }}
      >
        <SpecComponent spec={editing} />
      </SpecEditingContext.Provider>
    </ValidationComponent>
  );
};
