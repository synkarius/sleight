import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../features/model/action/action';
import { Command } from '../../features/model/command/command';
import { getSelectorDomainMapper } from '../../features/model/selector/data/selector-domain-mapper';
import { SelectorDTO } from '../../features/model/selector/data/selector-dto';
import {
  isSelectorSpecItem,
  Spec,
} from '../../features/model/spec/data/spec-domain';
import { getSpecDomainMapper } from '../../features/model/spec/data/spec-domain-mapper';

/**
 * Makes a copy of the relevant Redux slices.
 */
export type DataCopierFn<T1> = (
  editing: T1,
  data: SleightDataInternalFormat
) => SleightDataInternalFormat;

const specMapper = getSpecDomainMapper();
const selectorMapper = getSelectorDomainMapper();

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
