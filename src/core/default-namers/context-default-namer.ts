import { Ided, Typed } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';
import { ContextType } from '../../data/model/context/context-types';

interface IdedAndTyped extends Ided, Typed<ContextType.Type> {}

export const getDefaultContextNamer: () => DefaultNamer<IdedAndTyped> = () => ({
  getDefaultName: (context) =>
    context.type.toLowerCase().slice(0, 3).replaceAll(' ', '-') +
    '-' +
    ElementType.Enum.CONTEXT.toLowerCase().slice(0, 3) +
    '-' +
    context.id.slice(0, 13),
});
