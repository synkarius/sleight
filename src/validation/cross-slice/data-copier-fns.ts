import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../data/model/action/action';
import { Command } from '../../data/model/command/command';
import { SelectorDTO } from '../../data/model/selector/selector-dto';
import { isSelectorSpecItem, Spec } from '../../data/model/spec/spec-domain';
import { isChoiceVariable, Variable } from '../../data/model/variable/variable';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

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
  const selectorMapper = container.get(Tokens.DomainMapper_Selector);
  const specMapper = container.get(Tokens.DomainMapper_Spec);
  //
  const copy = structuredClone(data);
  const specDTO = specMapper.mapFromDomain(spec);
  const selectorDTOs = spec.items
    .filter(isSelectorSpecItem)
    .map((item) => item.selector)
    .map((selector) => selectorMapper.mapFromDomain(selector))
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
  const selectorMapper = container.get(Tokens.DomainMapper_Selector);
  const variableMapper = container.get(Tokens.DomainMapper_Variable);
  //
  const copy = structuredClone(data);
  const variableDTO = variableMapper.mapFromDomain(variable);
  const selectorDTOs =
    (isChoiceVariable(variable) &&
      variable.items
        .map((item) => item.selector)
        .map((selector) => selectorMapper.mapFromDomain(selector))
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
