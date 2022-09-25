import { Command } from '../../data/model/command/command';
import { DomainMapper } from '../mappers/mapper';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export class CommandMappingCleaner implements Cleaner<Command> {
  constructor(private commandMapper: DomainMapper<Command, Command>) {}

  clean(commands: Readonly<Command[]>): Command[] {
    return commands
      .map((commandDTO) => this.commandMapper.mapToDomain(commandDTO))
      .map((command) => this.commandMapper.mapFromDomain(command));
  }
}
