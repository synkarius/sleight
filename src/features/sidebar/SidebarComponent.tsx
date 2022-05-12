import React from 'react';
import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
import { createNewExtra } from '../model/extra/extra-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';

interface Item extends Named, Ided {}

interface ItemGroup {
  type: String;
  items: Item[];
  createFn: (e: React.MouseEvent<HTMLLinkElement>) => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const extras = useAppSelector((state) => state.extra.extras);

  const createNewExtraFn = (_e: React.MouseEvent<HTMLLinkElement>) => {
    dispatch(createNewExtra());
  };

  // TODO: get rid of this fake data
  const groups: ItemGroup[] = [
    { type: 'Action', items: [], createFn: (e) => {} },
    { type: '-Key', items: [], createFn: (e) => {} },
    { type: 'Extra', items: extras, createFn: createNewExtraFn },
  ];

  return (
    <Accordion defaultActiveKey={['2']} flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type.toString()}
          eventKey={'' + index}
          type={group.type.toString()}
          createFn={group.createFn}
          items={group.items}
        />
      ))}
    </Accordion>
  );
};
