import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../ui/model/action/action';
import { Command } from '../../ui/model/command/command';
import { SelectorDTO } from '../../ui/model/selector/data/selector-dto';
import { isSelectorSpecItem, Spec } from '../../ui/model/spec/data/spec-domain';
import {
  isChoiceVariable,
  Variable,
} from '../../ui/model/variable/data/variable';

/**
 * Makes a copy of the relevant Redux slices.
 */
export type DataCopierFn<T1> = (
  editing: T1,
  data: SleightDataInternalFormat
) => SleightDataInternalFormat;

export const actionDataCopierFn: DataCopierFn<Action> = (action, data) => {
  const copy = structuredClone(data);
  return {
    ...copy,
    actions: { ...copy.actions, [action.id]: action },
  };
};

export const commandDataCopierFn: DataCopierFn<Command> = (command, data) => {
  const copy = structuredClone(data);
  return {
    ...copy,
    commands: { ...copy.commands, [command.id]: command },
  };
};

export const specDataCopierFn: DataCopierFn<Spec> = (spec, data) => {
  const injected = getDefaultInjectionContext();
  const selectorMapper = injected.mappers.selector;
  const specMapper = injected.mappers.spec;
  //
  const copy = structuredClone(data);
  const specDTO = specMapper.mapFromDomain(spec);
  const selectorDTOs = spec.items
    .filter(isSelectorSpecItem)
    .map((item) => item.selector)
    .map(selectorMapper.mapFromDomain)
    .reduce((map, selector) => {
      map[selector.id] = selector;
      return map;
    }, {} as Record<string, SelectorDTO>);
  return {
    ...copy,
    selectors: { ...copy.selectors, ...selectorDTOs },
    specs: { ...copy.specs, [spec.id]: specDTO },
  };
};

export const variableDataCopierFn: DataCopierFn<Variable> = (
  variable,
  data
) => {
  const injected = getDefaultInjectionContext();
  const selectorMapper = injected.mappers.selector;
  const variableMapper = injected.mappers.variable;
  //
  const copy = structuredClone(data);
  const variableDTO = variableMapper.mapFromDomain(variable);
  const selectorDTOs =
    (isChoiceVariable(variable) &&
      variable.items
        .map((item) => item.selector)
        .map(selectorMapper.mapFromDomain)
        .reduce((map, selector) => {
          map[selector.id] = selector;
          return map;
        }, {} as Record<string, SelectorDTO>)) ||
    {};
  return {
    ...copy,
    selectors: { ...copy.selectors, ...selectorDTOs },
    variables: { ...copy.variables, [variable.id]: variableDTO },
  };
};
