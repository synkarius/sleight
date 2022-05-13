import React from 'react';
import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
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

interface ItemGroup {
  type: string;
  items: Item[];
  createFn: (e: React.MouseEvent<HTMLLinkElement>) => void;
  selectFn: (id: string) => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const contexts = useAppSelector((state) => state.context.contexts);
  const variables = useAppSelector((state) => state.extra.extras);

  // TODO: fill these in from redux
  const groups: ItemGroup[] = [
    {
      type: 'Action',
      items: [],
      createFn: (e) => {},
      selectFn: (id) => {},
    },
    {
      type: 'Command',
      items: [],
      createFn: (e) => {},
      selectFn: (id) => {},
    },
    {
      type: 'Context',
      items: contexts,
      createFn: (_e) => dispatch(createNewContext()),
      selectFn: (id) => dispatch(selectContext(id)),
    },
    {
      type: 'Role',
      items: [],
      createFn: (e) => {},
      selectFn: (id) => {},
    },
    {
      type: 'Spec',
      items: [],
      createFn: (e) => {},
      selectFn: (id) => {},
    },
    {
      type: 'Variable',
      items: variables,
      createFn: (_e) => dispatch(createNewExtra()),
      selectFn: (id) => dispatch(selectExtra(id)),
    },
  ];

  return (
    <Accordion defaultActiveKey={['2']} flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type}
          eventKey={'' + index}
          type={group.type}
          createFn={group.createFn}
          selectFn={group.selectFn}
          items={group.items}
        />
      ))}
    </Accordion>
  );
};
