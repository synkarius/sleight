import { SleightDataInternalFormat } from '../../data/data-formats';
import { Action } from '../../features/model/action/action';
import {
  Command,
  isSelectedSpecCommand,
} from '../../features/model/command/command';
import { Spec } from '../../features/model/spec/data/spec-domain';

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
  return Object.values(data.commands)
    .filter(isSelectedSpecCommand)
    .filter((command) => command.specId === editing.id);
};
