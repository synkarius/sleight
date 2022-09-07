import { Ided } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';

export const getDefaultSpecNamer: () => DefaultNamer<Ided> = () => ({
  getDefaultName: (spec) =>
    ElementType.Enum.SPEC.toLowerCase().slice(0, 3) +
    '-' +
    spec.id.slice(0, 13),
});
