import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  getEditorCreatePath,
  getEditorEditPath,
} from '../../../../navigation/router-fns';
import { SidebarSection } from './sidebar';

export const SideBarGroupComponent: React.FC<{
  key: string | number;
  group: SidebarSection;
  eventKey: string;
}> = (props) => {
  const navigate = useNavigate();

  const createNewItem = () => {
    navigate(getEditorCreatePath(props.group.type));
  };
  const selectItem = (elementId: string) => {
    navigate(getEditorEditPath(props.group.type, elementId));
  };

  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>{props.group.type}s</Accordion.Header>
      <Accordion.Body className="px-0">
        <ListGroup defaultActiveKey={props.group.type} variant="flush">
          <ListGroup.Item
            action
            eventKey={props.group.type}
            onClick={createNewItem}
          >
            Create New {props.group.type}
          </ListGroup.Item>
          {props.group.elements.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={(_e) => selectItem(item.id)}
            >
              {item.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
};
