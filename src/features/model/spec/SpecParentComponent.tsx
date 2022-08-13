import { useContext, useReducer } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createSpec, Spec } from './data/spec-domain';
import { specDomainMapper } from './data/spec-domain-mapper';
import { SpecDTO } from './data/spec-dto';
import { SpecEditingContext } from './spec-editing-context';
import { specReactReducer } from './spec-reducers';
import { SpecComponent } from './SpecComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { InjectionContext } from '../../../di/injector-context';

type SpecInitFunction = (specId?: string) => Spec;

const getSpecInitFunction = (
  savedSpecMap: Record<string, SpecDTO>,
  savedSelectorMap: Record<string, SelectorDTO>
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
  const injectionContext = useContext(InjectionContext);

  return (
    <ValidationComponent<Spec>
      validators={[...injectionContext.validators.spec]}
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
