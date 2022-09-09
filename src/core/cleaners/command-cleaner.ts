import { Command } from '../../data/model/command/command';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export const getCommandMappingCleaner = (): Cleaner<Command> => {
  return {
    clean: (commands) => {
      const injected = getDefaultInjectionContext();
      const commandMapper = injected.mappers.command;
      return commands
        .map((commandDTO) => commandMapper.mapToDomain(commandDTO))
        .map((command) => commandMapper.mapFromDomain(command));
    },
  };
};
