import React, { useContext, useId, useState } from 'react';
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
import { useAllData } from '../../../app/custom-hooks/use-all-data-hook';
import { OpenCommandListItem } from '../../../core/command-list/open-list-item';
import { ElementType } from '../../../data/model/element-types';
import { Tokens } from '../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../di/injector-context';
import { ActionComponent } from '../../model/action/ActionComponent';
import { CommandComponent } from '../../model/command/CommandComponent';
import { ContextComponent } from '../../model/context/ContextComponent';
import { SpecComponent } from '../../model/spec/SpecComponent';
import { VariableComponent } from '../../model/variable/VariableComponent';
import { PanelComponent } from '../PanelComponent';

export const CommandListViewComponent: React.FC<{}> = () => {
  const [contextSearch, setContextSearch] = useState('');
  const [openItem, setOpenItem] = useState<OpenCommandListItem | undefined>();
  const searchFormId = useId();
  const container = useContext(InjectionContext);
  const data = useAllData();

  const contextSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setContextSearch(event.target.value);
  const closeItem = () => setOpenItem(undefined);
  const helper = container.get(Tokens.CommandListHelper);

  const items = helper.mapDataToListItems(data, { contextSearch });

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
                    <Button
                      className="mx-1"
                      onClick={() =>
                        setOpenItem({
                          type: ElementType.Enum.COMMAND,
                          commandId: item.command.id,
                        })
                      }
                    >
                      Command
                    </Button>
                    <Button
                      className="mx-1"
                      onClick={() =>
                        setOpenItem({
                          type: ElementType.Enum.SPEC,
                          commandId: item.command.id,
                          specId: item.spec.id,
                        })
                      }
                    >
                      Spec
                    </Button>
                    {item.context && (
                      <Button
                        className="mx-1"
                        onClick={() =>
                          setOpenItem({
                            type: ElementType.Enum.CONTEXT,
                            commandId: item.command.id,
                            contextId: item.context!.id,
                          })
                        }
                      >
                        Context
                      </Button>
                    )}
                    {!!item.actions.length && (
                      <DropdownButton
                        className="mx-1"
                        as={ButtonGroup}
                        title="Actions"
                        id={`${item.command.id}-actions`}
                      >
                        {item.actions.map((action, index) => (
                          <Dropdown.Item
                            key={`${item.command.id}-${action.id}`}
                            eventKey={`${index}`}
                            onClick={() =>
                              setOpenItem({
                                type: ElementType.Enum.ACTION,
                                commandId: item.command.id,
                                actionId: action.id,
                              })
                            }
                          >
                            {action.name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    )}
                    {!!item.variables.length && (
                      <DropdownButton
                        className="mx-1"
                        as={ButtonGroup}
                        title="Variables"
                        id={`${item.command.id}-variables`}
                      >
                        {item.variables.map((variable, index) => (
                          <Dropdown.Item
                            key={`${item.command.id}-${variable.id}`}
                            eventKey={`${index}`}
                            onClick={() =>
                              setOpenItem({
                                type: ElementType.Enum.VARIABLE,
                                commandId: item.command.id,
                                variableId: variable.id,
                              })
                            }
                          >
                            {variable.name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    )}
                  </Col>
                </Row>
                {openItem &&
                  openItem.type === ElementType.Enum.ACTION &&
                  openItem.commandId === item.command.id &&
                  item.command.actionIds.includes(openItem.actionId) && (
                    <ActionComponent
                      actionId={openItem.actionId}
                      closeFn={closeItem}
                    />
                  )}
                {openItem &&
                  openItem.type === ElementType.Enum.COMMAND &&
                  openItem.commandId === item.command.id && (
                    <CommandComponent
                      commandId={openItem.commandId}
                      closeFn={closeItem}
                    />
                  )}
                {openItem &&
                  openItem.type === ElementType.Enum.CONTEXT &&
                  openItem.commandId === item.command.id &&
                  openItem.contextId === item.context?.id && (
                    <ContextComponent
                      contextId={openItem.contextId}
                      closeFn={closeItem}
                    />
                  )}
                {openItem &&
                  openItem.type === ElementType.Enum.SPEC &&
                  openItem.commandId === item.command.id &&
                  openItem.specId === item.spec.id && (
                    <SpecComponent
                      specId={openItem.specId}
                      closeFn={closeItem}
                    />
                  )}
                {openItem &&
                  openItem.type === ElementType.Enum.VARIABLE &&
                  openItem.commandId === item.command.id &&
                  item.variables
                    .map((v) => v.id)
                    .includes(openItem.variableId) && (
                    <VariableComponent
                      variableId={openItem.variableId}
                      closeFn={closeItem}
                    />
                  )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </PanelComponent>
    </>
  );
};
