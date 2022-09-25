import { Ided } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';

export class DefaultCommandNamer implements DefaultNamer<Ided> {
  getDefaultName(command: Ided): string {
    return (
      ElementType.Enum.COMMAND.toLowerCase().slice(0, 3) +
      '-' +
      command.id.slice(0, 13)
    );
  }
}
