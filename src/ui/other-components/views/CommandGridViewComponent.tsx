import React, { useId, useState } from 'react';
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  Row,
} from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Command } from '../../../data/model/command/command';
import { Context } from '../../../data/model/context/context';
import { CommandParentComponent } from '../../model/command/CommandParentComponent';
import { PanelComponent } from '../PanelComponent';

const GLOBAL_CONTEXT = 'global';

const getContextKey = (contextId?: string): string => contextId ?? '';
type GridItem = {
  command: Command;
  context?: Context;
};
const sortCommands = (a: Command, b: Command): number => {
  return getContextKey(a.contextId) < getContextKey(b.contextId) ? -1 : 1;
};
const filterItem = (item: GridItem, contextSearch: string): boolean => {
  const global =
    !item.context &&
    (contextSearch === '' || contextSearch.toLowerCase() === GLOBAL_CONTEXT);
  const contextMatch = !!(
    item.context &&
    (item.context.name.toLowerCase().includes(contextSearch.toLowerCase()) ||
      item.context.matcher.toLowerCase().includes(contextSearch.toLowerCase()))
  );
  return global || contextMatch;
};

export const CommandGridViewComponent: React.FC<{}> = () => {
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const [contextSearch, setContextSearch] = useState('');
  const [showCommand, setShowCommand] = useState<string | undefined>();
  const searchFormId = useId();

  const items: GridItem[] = Object.values(commands)
    .sort(sortCommands)
    .map((command) => ({
      command,
      context: contexts[command.contextId ?? GLOBAL_CONTEXT],
    }))
    .filter((item) => filterItem(item, contextSearch));

  const contextSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContextSearch(event.target.value);
  };

  return (
    <>
      <PanelComponent>
        <Form.Group as={Row} className="m-1" controlId={searchFormId}>
          <Form.Label column sm={2}>
            Context Filter
          </Form.Label>
          <Col sm={10}>
            <FormControl
              aria-label={'context search'}
              type="text"
              onChange={contextSearchHandler}
              value={contextSearch}
              placeholder='name or matcher of context or "Global"'
            />
          </Col>
        </Form.Group>
      </PanelComponent>
      <PanelComponent scrollable={true}>
        <Accordion>
          {items.map((item, index) => (
            <Accordion.Item key={`${item.command.id}`} eventKey={`${index}`}>
              <Accordion.Header>
                <Col sm="2">
                  <span>{`${item.context?.name ?? 'Global'} /`}</span>
                </Col>
                <Col sm="4">
                  <span>{item.command.name}</span>
                </Col>
              </Accordion.Header>
              <Accordion.Body>
                <Row className="px-1">
                  <Col sm="12">
                    <Button className="mx-1">Command</Button>
                    <Button className="mx-1">Spec</Button>
                    {item.context && <Button className="mx-1">Context</Button>}
                    <DropdownButton
                      className="mx-1"
                      as={ButtonGroup}
                      title="Actions"
                      id="bg-nested-dropdown"
                    >
                      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                      className="mx-1"
                      as={ButtonGroup}
                      title="Variables"
                      id="bg-nested-dropdown"
                    >
                      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>

                <CommandParentComponent commandId={item.command.id} />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </PanelComponent>
    </>
  );
};
