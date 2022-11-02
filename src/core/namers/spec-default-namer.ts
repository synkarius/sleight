import { Ided } from '../../data/model/domain';
import { Namer } from './namer';
import { ElementType } from '../../data/model/element-types';

export class DefaultSpecNamer implements Namer<Ided> {
  getName(spec: Ided): string {
    return (
      ElementType.Enum.SPEC.toLowerCase().slice(0, 3) +
      '-' +
      spec.id.slice(0, 13)
    );
  }
}
