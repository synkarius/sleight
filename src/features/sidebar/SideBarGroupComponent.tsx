import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../app/hooks';
import { setEditorFocus } from '../menu/editor/editor-focus-reducers';
import { SidebarSection } from './sidebar';

export const SideBarGroupComponent: React.FC<{
  key: string | number;
  group: SidebarSection;
  eventKey: string;
}> = (props) => {
  const reduxDispatch = useAppDispatch();

  const createNewItem = () => {
    props.group.createFn();
    reduxDispatch(setEditorFocus(props.group.type));
  };
  const selectItem = (itemId: string) => {
    props.group.selectFn(itemId);
    reduxDispatch(setEditorFocus(props.group.type));
  };

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
            onClick={createNewItem}
          >
            Create New {props.group.type}
          </ListGroup.Item>
          {props.group.items.map((item) => (
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
