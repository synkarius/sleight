import { Ided } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';

export const getDefaultCommandNamer: () => DefaultNamer<Ided> = () => ({
  getDefaultName: (command) =>
    ElementType.Enum.COMMAND.toLowerCase().slice(0, 3) +
    '-' +
    command.id.slice(0, 13),
});
