import { Ided, Typed } from '../../domain';
import { DefaultNamer } from '../common/default-namer';
import { ElementType } from '../common/element-types';
import { ContextType } from './context-types';

interface IdedAndTyped extends Ided, Typed<ContextType.Type> {}

export const contextDefaultNamer: DefaultNamer<IdedAndTyped> = {
  getDefaultName: (context) =>
    context.type.toLowerCase().slice(0, 3).replaceAll(' ', '-') +
    '-' +
    ElementType.Enum.CONTEXT.toLowerCase().slice(0, 3) +
    '-' +
    context.id.slice(0, 13),
};
