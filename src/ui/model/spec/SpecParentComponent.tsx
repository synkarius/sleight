import { useContext, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ValidationComponent } from '../../../validation/ValidationComponent';
import { createSpec, Spec } from '../../../data/model/spec/spec-domain';
import { SpecDTO } from '../../../data/model/spec/spec-dto';
import { SpecEditingContext } from './spec-editing-context';
import {
  deleteSpec,
  specReactReducer,
} from '../../../core/reducers/spec-reducers';
import { SpecComponent } from './SpecComponent';
import { SelectorDTO } from '../../../data/model/selector/selector-dto';
import { InjectionContext } from '../../../di/injector-context';
import { SpecDomainMapper } from '../../../core/mappers/spec-domain-mapper';
import { DeleteModalComponent } from '../../other-components/DeleteModalComponent';
import { Field } from '../../../validation/validation-field';
import { Tokens } from '../../../di/config/brandi-tokens';
import { useNavigate } from 'react-router-dom';
import { EMPTY_PATH } from '../../../core/common/consts';

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
  const navigate = useNavigate();
  const specs = useAppSelector((state) => state.spec.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const container = useContext(InjectionContext);
  const [editing, localDispatch] = useReducer(
    specReactReducer,
    props.specId,
    getSpecInitFunction(
      specs,
      selectors,
      container.get(Tokens.DomainMapper_Spec)
    )
  );
  const [show, setShow] = useState(false);

  const handleDelete = () => {
    reduxDispatch(deleteSpec(editing.id));
    navigate(EMPTY_PATH);
  };
  const deleteModalConfig = { show, setShow };
  const validators = container.get(Tokens.Validators_Spec);

  return (
    <ValidationComponent<Spec> validators={validators} editing={editing}>
      <SpecEditingContext.Provider value={{ localDispatch, deleteModalConfig }}>
        <SpecComponent spec={editing} />
        <DeleteModalComponent
          deletingName={editing.name}
          config={deleteModalConfig}
          deleteFn={handleDelete}
          deleteField={Field.SP_DELETE_MODAL_DELETE}
          cancelField={Field.SP_DELETE_MODAL_CANCEL}
        />
      </SpecEditingContext.Provider>
    </ValidationComponent>
  );
};
