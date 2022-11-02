import { Ided, Typed } from '../../data/model/domain';
import { Namer } from './namer';
import { ElementType } from '../../data/model/element-types';
import { VariableType } from '../../data/model/variable/variable-types';

export type IdedAndVariableTyped = Ided & Typed<VariableType.Type>;

export class DefaultVariableNamer implements Namer<IdedAndVariableTyped> {
  getName(variable: IdedAndVariableTyped): string {
    return (
      variable.type.toLowerCase() +
      '-' +
      ElementType.Enum.VARIABLE.toLowerCase().slice(0, 3) +
      '-' +
      variable.id.slice(0, 13)
    );
  }
}
