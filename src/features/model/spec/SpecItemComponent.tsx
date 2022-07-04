import React, { useId } from 'react';
import {
  Button,
  Col,
  Container,
  FormGroup,
  FormLabel,
  FormSelect,
  FormText,
  Row,
} from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { PanelComponent } from '../../ui/PanelComponent';
import { MoveDirection } from '../common/move-direction';
import { Variable } from '../variable/variable';
import { VariablesDropdownComponent } from '../variable/VariablesDropdownComponent';
import { createSelector, Selector } from '../selector/selector';
import { createNewSelector } from '../selector/selector-reducers';
import { SelectorComponent } from '../selector/SelectorComponent';
import {
  ChangeSpecItemVariableIdPayload,
  SpecItem,
  SpecItemType,
} from './spec';
import {
  changeSpecItemOrder,
  changeSpecItemType,
  changeSpecItemVariableId,
  deleteSpecItem,
} from './spec-reducers';

export const SpecItemComponent: React.FC<{ specItem: SpecItem }> = (props) => {
  const dispatch = useAppDispatch();
  const typeInputId = useId();
  const selectors = useAppSelector((state) => state.selector.saved);
  const variables = useAppSelector((state) => state.variable.saved);

  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let newSpecItemId: string | undefined;
    const newSpecItemType = event.target.value;

    switch (newSpecItemType) {
      case SpecItemType.SELECTOR:
        const selector = createSelector();
        newSpecItemId = selector.id;
        dispatch(createNewSelector(selector));
        break;
      case SpecItemType.VARIABLE:
        // using the 0th item b/c it's the first item in the list the user selects from
        newSpecItemId = Object.values(variables)[0].id;
        break;
      default:
        throw new Error('invalid spec item type: ' + newSpecItemType);
    }
    dispatch(
      changeSpecItemType({
        specItemId: props.specItem.id,
        specItemItemId: newSpecItemId,
        specItemItemType: newSpecItemType,
      })
    );
  };
  const moveHandler = (specItemId: string, moveDirection: string) => {
    dispatch(
      changeSpecItemOrder({
        specItemId: specItemId,
        moveDirection: moveDirection,
      })
    );
  };
  const deleteHandler = (_event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(deleteSpecItem(props.specItem.id));
  };
  const changeSpecItemVariableIdActionCreator = (newVariableId: string) => {
    return changeSpecItemVariableId({
      specItemId: props.specItem.id,
      variableId: newVariableId,
    });
  };

  const selector: Selector | undefined =
    props.specItem.itemType === SpecItemType.SELECTOR
      ? selectors[props.specItem.itemId]
      : undefined;
  const variable: Variable | undefined =
    props.specItem.itemType === SpecItemType.VARIABLE
      ? variables[props.specItem.itemId]
      : undefined;

  return (
    <PanelComponent>
      <Container>
        <Row>
          <Col sm="10">
            <FormGroup as={Row} className="mb-3" controlId={typeInputId}>
              <FormLabel column sm="2">
                Type
              </FormLabel>
              <Col sm="10">
                <FormSelect
                  aria-label="Spec item type selection"
                  onChange={typeChangedHandler}
                  value={props.specItem.itemType}
                >
                  {SpecItemType.values().map((sit) => (
                    <option key={sit} value={sit}>
                      {sit}
                    </option>
                  ))}
                </FormSelect>
                <FormText className="text-muted">kind of spec item</FormText>
              </Col>
            </FormGroup>
            {selector && (
              <SelectorComponent showLabel={false} selector={selector} />
            )}
            {variable && (
              <VariablesDropdownComponent<ChangeSpecItemVariableIdPayload>
                selectedVariableId={variable.id}
                payloadFn={changeSpecItemVariableIdActionCreator}
                variableTypeFilter={null}
              />
            )}
          </Col>
          <Col sm="2">
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) =>
                  moveHandler(props.specItem.id, MoveDirection.UP)
                }
              >
                Move <ArrowUp />{' '}
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                variant="warning"
                onClick={deleteHandler}
              >
                Delete
              </Button>
            </Row>
            <Row>
              <Button
                className="mb-3"
                onClick={(_e) =>
                  moveHandler(props.specItem.id, MoveDirection.DOWN)
                }
              >
                Move <ArrowDown />
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </PanelComponent>
  );
};
