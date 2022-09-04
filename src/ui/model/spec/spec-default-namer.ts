import { Ided } from '../../domain';
import { DefaultNamer } from '../../../common/default-namer';
import { ElementType } from '../../../common/element-types';

export const getDefaultSpecNamer: () => DefaultNamer<Ided> = () => ({
  getDefaultName: (spec) =>
    ElementType.Enum.SPEC.toLowerCase().slice(0, 3) +
    '-' +
    spec.id.slice(0, 13),
});
