import { useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ReduxFriendlyStringMap } from '../../../util/string-map';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createSpec, Spec } from './data/spec-domain';
import { specDomainMapper } from './data/spec-domain-mapper';
import { SpecDTO } from './data/spec-dto';
import { SpecEditingContext } from './spec-editing-context';
import { specReactReducer } from './spec-reducers';
import { SpecComponent } from './SpecComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import {
  atLeastOneSpecItem,
  specSelectorItemsCantBeEmpty,
  specVariableMustBeSelected,
} from './spec-validators';

type SpecInitFunction = (specId?: string) => Spec;

const getSpecInitFunction = (
  savedSpecMap: ReduxFriendlyStringMap<SpecDTO>,
  savedSelectorMap: ReduxFriendlyStringMap<SelectorDTO>
): SpecInitFunction => {
  return (specId?: string) => {
    if (specId && savedSpecMap[specId]) {
      return specDomainMapper.mapToDomain(
        savedSpecMap[specId],
        savedSelectorMap
      );
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
      validators={[
        atLeastOneSpecItem,
        specSelectorItemsCantBeEmpty,
        specVariableMustBeSelected,
      ]}
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
