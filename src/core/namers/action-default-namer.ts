import { Ided, Typed } from '../../data/model/domain';
import { Namer } from './namer';
import { ElementType } from '../../data/model/element-types';
import { ActionType } from '../../data/model/action/action-types';

export type IdedAndActionTyped = Ided & Typed<ActionType.Type>;

export class DefaultActionNamer implements Namer<IdedAndActionTyped> {
  getName(action: IdedAndActionTyped): string {
    return (
      action.type.toLowerCase().replaceAll(' ', '-') +
      '-' +
      ElementType.Enum.ACTION.toLowerCase().slice(0, 3) +
      '-' +
      action.id.slice(0, 13)
    );
  }
}
