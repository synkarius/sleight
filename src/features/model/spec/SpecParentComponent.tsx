import { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createSpec, Spec } from './data/spec-domain';
import { SpecDTO } from './data/spec-dto';
import { SpecEditingContext } from './spec-editing-context';
import { deleteSpec, specReactReducer } from './spec-reducers';
import { SpecComponent } from './SpecComponent';
import { SelectorDTO } from '../selector/data/selector-dto';
import { InjectionContext } from '../../../di/injector-context';
import { SpecDomainMapper } from './data/spec-domain-mapper';
import { setEditorFocus } from '../../menu/editor/editor-focus-reducers';
import { DeleteModal } from '../../ui/DeleteModal';

type SpecInitFunction = (specId?: string) => Spec;

const getSpecInitFunction = (
  savedSpecMap: Record<string, SpecDTO>,
  savedSelectorMap: Record<string, SelectorDTO>,
  specDomainMapper: SpecDomainMapper
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
  const reduxDispatch = useAppDispatch();
  const specs = useAppSelector((state) => state.spec.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const injectionContext = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    specReactReducer,
    props.specId,
    getSpecInitFunction(specs, selectors, injectionContext.mappers.spec)
  );
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteSpec(editing.id));
    reduxDispatch(setEditorFocus());
  };
  const deleteModalConfig = { show, setShow };

  return (
    <ValidationComponent<Spec>
      validators={[...injectionContext.validators.spec]}
      editing={editing}
    >
      <SpecEditingContext.Provider value={{ localDispatch, deleteModalConfig }}>
        <SpecComponent spec={editing} />
        <DeleteModal
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
        />
      </SpecEditingContext.Provider>
    </ValidationComponent>
  );
};
