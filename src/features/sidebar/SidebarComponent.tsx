import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
import { ElementType } from '../model/common/element-types';
import {
  clearEditingContext,
  createNewEditingContext,
  selectContext,
} from '../model/context/context-reducers';
import {
  clearEditingExtra,
  createNewEditingExtra,
  selectExtra,
} from '../model/extra/extra-reducers';
import { createText } from '../model/extra/text/text';
import { createSelector } from '../model/selector/selector';
import {
  clearEditingSelectors,
  createNewEditingSelector,
} from '../model/selector/selector-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';

interface Item extends Named, Ided {}

export interface ItemGroup {
  type: string;
  items: Item[];
  createFn: () => void;
  selectFn: (variableId: string) => void;
  clearFn: () => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const variablesSaved = useAppSelector((state) => state.extra.saved);
  const variableEditing = useAppSelector((state) => state.extra.editing);

  // TODO: move these elsewhere & restructure
  const groups: ItemGroup[] = [
    {
      type: ElementType.ACTION,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.COMMAND,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.CONTEXT,
      items: contextsSaved,
      createFn: () => dispatch(createNewEditingContext()),
      selectFn: (id) => dispatch(selectContext(id)),
      clearFn: () => dispatch(clearEditingContext()),
    },
    {
      type: ElementType.KEY,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.SPEC,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.VARIABLE,
      items: variablesSaved,
      createFn: () => {
        const text = createText();
        const selector = createSelector();
        text.selectorIds.push(selector.id);
        dispatch(createNewEditingSelector(selector));
        dispatch(createNewEditingExtra(text));
      },
      selectFn: (variableId) => dispatch(selectExtra(variableId)),
      clearFn: () => {
        dispatch(clearEditingExtra());
        dispatch(clearEditingSelectors());
      },
    },
  ];

  const clearAllWorkspaces = () => groups.forEach((group) => group.clearFn());
  const clearFns = groups.map((group) => group.clearFn);

  return (
    <Accordion defaultActiveKey={['2']} flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type}
          eventKey={'' + index}
          group={group}
          clearAllFn={clearAllWorkspaces}
        />
      ))}
    </Accordion>
  );
};
