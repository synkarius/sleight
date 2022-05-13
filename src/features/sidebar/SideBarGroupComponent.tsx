import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../app/hooks';
import { Named, Ided } from '../domain';
import { clearFocusedContext } from '../model/context/context-reducers';
import { clearFocusedExtra } from '../model/extra/extra-reducers';

interface Item extends Named, Ided {}

interface SideBarGroupProps {
  eventKey: string;
  type: string;
  createFn: (e: React.MouseEvent<HTMLLinkElement>) => void;
  selectFn: (id: string) => void;
  items: Item[];
}

export const SideBarGroupComponent: React.FC<SideBarGroupProps> = (props) => {
  const dispatch = useAppDispatch();
  const clearAllWorkspaces = () => {
    dispatch(clearFocusedContext());
    dispatch(clearFocusedExtra());
  };

  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.type}s</Accordion.Header>
      <Accordion.Body className="px-0">
        <ListGroup
          defaultActiveKey={'#create-new-' + props.type}
          variant="flush"
        >
          <ListGroup.Item
            action
            href={'#create-new-' + props.type}
            onClick={props.createFn}
          >
            Create New {props.type}
          </ListGroup.Item>
          {props.items.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={(_e) => {
                clearAllWorkspaces();
                props.selectFn(item.id);
              }}
            >
              {item.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
};
