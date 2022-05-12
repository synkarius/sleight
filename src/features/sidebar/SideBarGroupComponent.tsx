import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../app/hooks';
import { Named, Ided } from '../domain';
import { selectExtra } from '../model/extra/extra-reducers';

interface Item extends Named, Ided {}

interface SideBarGroupProps {
  eventKey: string;
  type: string;
  createFn: (e: React.MouseEvent<HTMLLinkElement>) => void;
  items: Item[];
}

export const SideBarGroupComponent: React.FC<SideBarGroupProps> = (props) => {
  const dispatch = useAppDispatch();
  const selectExtraFn = (extraId: string) => {
    dispatch(selectExtra(extraId));
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
              onClick={(_e) => selectExtraFn(item.id)}
            >
              {item.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
};
