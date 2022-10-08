import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';
import { Fn } from '../../../../data/model/fn/fn';
import { FnType } from '../../../../data/model/fn/fn-types';
import { ResourceType } from '../../../../data/model/resource-types';
import { WrongTypeError } from '../../../../error/wrong-type-error';
import {
  getEditorCreatePath,
  getEditorEditPath,
} from '../../../navigation/router-fns';

export const ResourcesEditorSidebarComponent: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const functions = useAppSelector((state) => state.fn.saved);

  const createNewFunction = () => {
    navigate(getEditorCreatePath(ResourceType.Enum.FN));
  };
  const selectFunction = (functionId: string) => {
    navigate(getEditorEditPath(ResourceType.Enum.FN, functionId));
  };
  const getFunctionName = (func: Fn) => {
    switch (func.type) {
      case FnType.Enum.PYTHON:
        return func.name;
      default:
        throw new WrongTypeError(func.type);
    }
  };

  return (
    <>
      <Accordion defaultActiveKey={['1']} flush alwaysOpen>
        <Accordion.Item eventKey={'1'}>
          <Accordion.Header>Functions</Accordion.Header>
          <Accordion.Body className="px-0">
            <ListGroup defaultActiveKey="create" variant="flush">
              <ListGroup.Item
                action
                eventKey={'create'}
                onClick={createNewFunction}
              >
                Create New Function
              </ListGroup.Item>
              {Object.values(functions).map((func) => (
                <ListGroup.Item
                  key={func.id}
                  action
                  onClick={(_e) => selectFunction(func.id)}
                >
                  {getFunctionName(func)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
