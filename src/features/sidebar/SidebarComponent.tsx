import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
import { ElementType } from '../model/common/element-types';
import {
  clearFocusedContext,
  createNewContext,
  selectContext,
} from '../model/context/context-reducers';
import {
  clearFocusedExtra,
  createNewExtra,
  selectExtra,
} from '../model/extra/extra-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';

interface Item extends Named, Ided {}

export interface ItemGroup {
  type: string;
  items: Item[];
  createFn: () => void;
  selectFn: (id: string) => void;
  clearFn: () => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const contexts = useAppSelector((state) => state.context.contexts);
  const variables = useAppSelector((state) => state.extra.extras);

  // TODO: fill these in from redux
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
      items: contexts,
      createFn: () => dispatch(createNewContext()),
      selectFn: (id) => dispatch(selectContext(id)),
      clearFn: () => dispatch(clearFocusedContext()),
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
      items: variables,
      createFn: () => dispatch(createNewExtra()),
      selectFn: (id) => dispatch(selectExtra(id)),
      clearFn: () => dispatch(clearFocusedExtra()),
    },
  ];

  const clearAllWorkspaces = () => groups.forEach((group) => group.clearFn());

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
