import { Ided, Named } from '../domain';

interface IdedAndNamed extends Ided, Named {}

export interface SidebarSection {
  type: string;
  items: IdedAndNamed[];
  createFn: () => void;
  selectFn: (variableId: string) => void;
  clearFn: () => void;
}
