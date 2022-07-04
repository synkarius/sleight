import React, { useId } from 'react';
import {
  Col,
  FormGroup,
  FormLabel,
  FormSelect,
  FormText,
  Row,
} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Variable } from '../variable/variable';
import { VariablesDropdownComponent } from '../variable/VariablesDropdownComponent';
import { createSelector, Selector } from '../selector/selector';
import { createNewSelector } from '../selector/selector-reducers';
import { SelectorComponent } from '../selector/SelectorComponent';
import {
  ChangeSpecItemOrderPayload,
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
import { UnhandledSpecItemTypeError } from '../../../error/UnhandledSpecItemTypeError';
import { VerticalMoveableComponent } from '../../ui/VerticalMoveableComponent';

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
        throw new UnhandledSpecItemTypeError(newSpecItemType);
    }
    dispatch(
      changeSpecItemType({
        specItemId: props.specItem.id,
        specItemItemId: newSpecItemId,
        specItemItemType: newSpecItemType,
      })
    );
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
    <VerticalMoveableComponent<ChangeSpecItemOrderPayload, string>
      moveFn={(direction) =>
        changeSpecItemOrder({
          specItemId: props.specItem.id,
          moveDirection: direction,
        })
      }
      deleteFn={() => deleteSpecItem(props.specItem.id)}
    >
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
      {selector && <SelectorComponent showLabel={false} selector={selector} />}
      {variable && (
        <VariablesDropdownComponent<ChangeSpecItemVariableIdPayload>
          selectedVariableId={variable.id}
          payloadFn={changeSpecItemVariableIdActionCreator}
          variableTypeFilter={null}
        />
      )}
    </VerticalMoveableComponent>
  );
};
