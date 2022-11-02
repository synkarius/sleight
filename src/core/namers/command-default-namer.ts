import { Ided } from '../../data/model/domain';
import { Namer } from './namer';
import { ElementType } from '../../data/model/element-types';

export class DefaultCommandNamer implements Namer<Ided> {
  getName(command: Ided): string {
    return (
      ElementType.Enum.COMMAND.toLowerCase().slice(0, 3) +
      '-' +
      command.id.slice(0, 13)
    );
  }
}
