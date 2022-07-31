import React, { useContext, useId } from 'react';
import { FormGroup, FormLabel, FormSelect, FormText } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { Variable } from '../variable/variable';
import { VariablesDropdownComponent } from '../variable/VariablesDropdownComponent';
import {
  createSelector,
  createSelectorItem,
  Selector,
} from '../selector/data/selector-domain';
import { SelectorComponent } from '../selector/SelectorComponent';
import { VerticalMoveableComponent } from '../../ui/VerticalMoveableComponent';
import { RequiredAsteriskComponent } from '../../ui/RequiredAsteriskComponent';
import { SpecItemType } from './spec-item-type';
import { ExhaustivenessFailureError } from '../../../error/ExhaustivenessFailureError';
import { SpecItem } from './data/spec-domain';
import { ValidationContext } from '../../../validation/validation-context';
import {
  SpecEditingContext,
  SpecReducerActionType,
} from './spec-editing-context';
import { MoveDirection } from '../common/move-direction';
import { Field } from '../../../validation/validation-field';
import { LIST, LIST_ITEM } from '../common/accessibility-roles';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { specSelectorItemsCantBeEmpty } from './spec-validators';

export const SpecItemComponent: React.FC<{
  specItem: SpecItem;
  required?: boolean;
}> = (props) => {
  const typeInputId = useId();
  const variables = useAppSelector((state) => state.variable.saved);
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(SpecEditingContext);

  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpecItemType = event.target.value as SpecItemType.Type;
    switch (newSpecItemType) {
      case SpecItemType.Enum.SELECTOR:
        editingContext.localDispatchFn({
          type: SpecReducerActionType.CHANGE_SPEC_ITEM_TYPE,
          payload: {
            specItemId: props.specItem.id,
            specItemType: SpecItemType.Enum.SELECTOR,
            selector: createSelector(),
          },
        });
        break;
      case SpecItemType.Enum.VARIABLE:
        // using the 0th item b/c it's the first item in the list the user selects from
        editingContext.localDispatchFn({
          type: SpecReducerActionType.CHANGE_SPEC_ITEM_TYPE,
          payload: {
            specItemId: props.specItem.id,
            specItemType: SpecItemType.Enum.VARIABLE,
            variableId: SELECT_DEFAULT_VALUE,
          },
        });
        break;
      default:
        throw new ExhaustivenessFailureError(newSpecItemType);
    }
  };
  const variableChangedHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_VARIABLE_ID,
      payload: {
        specItemId: props.specItem.id,
        variableId: e.target.value,
      },
    });
  };
  const specItemMovedHandler = (moveDirection: MoveDirection) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_ORDER,
      payload: {
        specItemId: props.specItem.id,
        moveDirection,
      },
    });
  };
  const deleteSpecItemHandler = () => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.DELETE_SPEC_ITEM,
      payload: props.specItem.id,
    });
  };
  const addSelectorItemHandler = () => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.ADD_SELECTOR_ITEM,
      payload: {
        specItemId: props.specItem.id,
        selectorItem: createSelectorItem(),
      },
    });
  };
  const changeSelectorItemHandler = (selectorItemId: string, value: string) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_SELECTOR_ITEM,
      payload: {
        specItemId: props.specItem.id,
        selectorItemId,
        value: value,
      },
    });
  };
  const deleteSelectorItemHandler = (selectorItemId: string) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.DELETE_SELECTOR_ITEM,
      payload: {
        specItemId: props.specItem.id,
        selectorItemId,
      },
    });
  };

  const selector: Selector | undefined =
    props.specItem.itemType === SpecItemType.Enum.SELECTOR
      ? props.specItem.selector
      : undefined;
  const variable: Variable | undefined =
    props.specItem.itemType === SpecItemType.Enum.VARIABLE
      ? variables[props.specItem.variableId]
      : undefined;

  return (
    <VerticalMoveableComponent
      moveFn={specItemMovedHandler}
      deleteFn={deleteSpecItemHandler}
    >
      <FormGroup className="mb-3" controlId={typeInputId}>
        <FormLabel>
          <span>Spec Item Type</span>
          <RequiredAsteriskComponent required={!!props.required} />
        </FormLabel>
        <FormSelect
          aria-label={Field[Field.SP_ITEM_TYPE_SELECT]}
          role={LIST}
          onChange={typeChangedHandler}
          value={props.specItem.itemType}
        >
          {SpecItemType.values().map((sit) => (
            <option key={sit} value={sit} role={LIST_ITEM}>
              {sit}
            </option>
          ))}
        </FormSelect>
        <FormText className="text-muted">kind of spec item</FormText>
      </FormGroup>
      {selector && (
        <SelectorComponent
          showLabel={false}
          selector={selector}
          selectorItemHandlers={{
            add: addSelectorItemHandler,
            change: changeSelectorItemHandler,
            delete: deleteSelectorItemHandler,
          }}
          field={Field.SP_ITEM_SELECTOR}
        />
      )}
      {props.specItem.itemType === SpecItemType.Enum.VARIABLE && (
        <VariablesDropdownComponent
          selectedVariableId={variable?.id}
          onChange={variableChangedHandler}
        />
      )}
    </VerticalMoveableComponent>
  );
};
