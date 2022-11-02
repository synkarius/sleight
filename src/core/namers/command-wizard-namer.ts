import { Command } from '../../data/model/command/command';
import { Ided } from '../../data/model/domain';
import { Namer } from './namer';

export class CommandWizardNamer implements Namer<Command> {
  constructor(private commandDefaultNamer: Namer<Ided>) {}

  getName(command: Command): string {
    const unique = this.commandDefaultNamer.getName(command);
    return `WG Command / ${unique}`;
  }
}
