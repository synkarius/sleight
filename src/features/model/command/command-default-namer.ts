import { Ided } from '../../domain';
import { DefaultNamer } from '../common/default-namer';
import { ElementType } from '../common/element-types';

export const commandDefaultNamer: DefaultNamer<Ided> = {
  getDefaultName: (command) =>
    ElementType.Enum.COMMAND.toLowerCase().slice(0, 3) +
    '-' +
    command.id.slice(0, 13),
};
