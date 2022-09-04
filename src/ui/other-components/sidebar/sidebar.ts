import { Ided, Named } from '../../domain';
import { ElementType } from '../../../common/element-types';

interface IdedAndNamed extends Ided, Named {}

export interface SidebarSection {
  type: ElementType.Type;
  items: IdedAndNamed[];
  createFn: () => void;
  selectFn: (variableId: string) => void;
}
