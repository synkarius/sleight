import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { ItemGroup } from './SidebarComponent';

export const SideBarGroupComponent: React.FC<{
  key: string | number;
  group: ItemGroup;
  eventKey: string;
  clearAllFn: () => void;
}> = (props) => {
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.group.type}s</Accordion.Header>
      <Accordion.Body className="px-0">
        <ListGroup
          defaultActiveKey={'#create-new-' + props.group.type}
          variant="flush"
        >
          <ListGroup.Item
            action
            href={'#create-new-' + props.group.type}
            onClick={props.group.createFn}
          >
            Create New {props.group.type}
          </ListGroup.Item>
          {props.group.items.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={(_e) => {
                props.clearAllFn();
                props.group.selectFn(item.id);
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
