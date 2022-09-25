import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../data/model/action/action';
import { Command } from '../../data/model/command/command';
import { Spec } from '../../data/model/spec/spec-domain';
import { SpecItemType } from '../../data/model/spec/spec-item-type';
import { Variable } from '../../data/model/variable/variable';
import { container } from '../../di/brandi-config';
import { Tokens } from '../../di/brandi-tokens';

/**
 * Given the editing element, finds one or more validated elements.
 */
export type FinderFn<T1, T2> = (
  editing: T1,
  data: SleightDataInternalFormat
) => T2[];

export const givenActionFindCommands: FinderFn<Action, Command> = (
  editing: Action,
  data: SleightDataInternalFormat
): Command[] => {
  return Object.values(data.commands).filter((command) =>
    command.actionIds.includes(editing.id)
  );
};

export const givenSpecFindCommands: FinderFn<Spec, Command> = (
  editing: Spec,
  data: SleightDataInternalFormat
): Command[] => {
  return Object.values(data.commands).filter(
    (command) => command.specId === editing.id
  );
};

export const givenSpecFindVariables: FinderFn<Spec, Variable> = (
  editing: Spec,
  data: SleightDataInternalFormat
): Variable[] => {
  const variableMapper = container.get(Tokens.DomainMapper_Variable);
  //
  const variableIdsInSpec = editing.items
    .filter((specItem) => specItem.itemType === SpecItemType.Enum.VARIABLE)
    .map((specItem) => specItem.id);

  return Object.values(data.variables)
    .filter((variableDTO) => variableIdsInSpec.includes(variableDTO.id))
    .map((variableDTO) =>
      variableMapper.mapToDomain(variableDTO, data.selectors)
    );
};

export const givenVariableFindSpecs: FinderFn<Variable, Spec> = (
  editing: Variable,
  data: SleightDataInternalFormat
): Spec[] => {
  const specMapper = container.get(Tokens.DomainMapper_Spec);
  //

  return Object.values(data.specs)
    .filter((specDTO) =>
      specDTO.items
        .filter(
          (specItemDTO) => specItemDTO.itemType === SpecItemType.Enum.VARIABLE
        )
        .map((specItemDTO) => specItemDTO.itemId)
        .includes(editing.id)
    )
    .map((specDTO) => specMapper.mapToDomain(specDTO, data.selectors));
};
