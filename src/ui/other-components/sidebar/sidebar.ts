import { Ided, Named } from '../../../data/model/domain';
import { ElementType } from '../../../data/model/element-types';

interface IdedAndNamed extends Ided, Named {}

export interface SidebarSection {
  type: ElementType.Type;
  elements: IdedAndNamed[];
}
