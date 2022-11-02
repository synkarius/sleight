import { Ided, Typed } from '../../data/model/domain';
import { Namer } from './namer';
import { ElementType } from '../../data/model/element-types';
import { ContextType } from '../../data/model/context/context-types';

export type IdedAndContextTyped = Ided & Typed<ContextType.Type>;

export class DefaultContextNamer implements Namer<IdedAndContextTyped> {
  getName(context: IdedAndContextTyped): string {
    return (
      context.type.toLowerCase().slice(0, 3).replaceAll(' ', '-') +
      '-' +
      ElementType.Enum.CONTEXT.toLowerCase().slice(0, 3) +
      '-' +
      context.id.slice(0, 13)
    );
  }
}
