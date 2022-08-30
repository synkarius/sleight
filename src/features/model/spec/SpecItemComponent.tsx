import React, { useContext, useId } from 'react';
import {
  FormCheck,
  FormGroup,
  FormLabel,
  FormSelect,
  FormText,
} from 'react-bootstrap';
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
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
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
import { ValidationResultType } from '../../../validation/validation-result';
import { FormGroupRowComponent } from '../../ui/FormGroupRowComponent';
import { processErrorResults } from '../../../validation/validation-result-processing';
import { ErrorTextComponent } from '../../ui/ErrorTextComponent';

export const SpecItemComponent: React.FC<{
  specItem: SpecItem;
  required?: boolean;
}> = (props) => {
  const optionalId = useId();
  const groupedId = useId();
  const typeInputId = useId();
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
    validationContext.touch(Field.SP_ITEM_TYPE_SELECT);
  };
  const variableChangedHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatchFn({
      type: SpecReducerActionType.CHANGE_SPEC_ITEM_VARIABLE_ID,
      payload: {
        specItemId: props.specItem.id,
        variableId: e.target.value,
      },
    });
    validationContext.touch(Field.SP_ITEM_VARIABLE);
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

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);
  const variableError = errorResults(
    [Field.SP_ITEM_VARIABLE],
    props.specItem.id
  );
  const optionalityError = errorResults(
    [Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL],
    props.specItem.id
  );

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
        <FormGroupRowComponent
          labelText="Variable"
          descriptionText="which variable to use for this spec item"
          errorMessage={variableError}
        >
          <VariablesDropdownComponent
            field={Field.SP_ITEM_VARIABLE}
            selectedVariableId={props.specItem.variableId}
            onChange={variableChangedHandler}
            onBlur={(_e) => validationContext.touch(Field.SP_ITEM_VARIABLE)}
            isInvalid={!!variableError}
          />
        </FormGroupRowComponent>
      )}
      <FormGroupRowComponent labelText="Spec Item Optionality">
        <FormCheck
          type="switch"
          id={optionalId}
          label="Optional"
          checked={props.specItem.optional}
          onChange={(_e) => {
            editingContext.localDispatchFn({
              type: SpecReducerActionType.TOGGLE_SPEC_ITEM_OPTIONAL,
              payload: props.specItem.id,
            });
            validationContext.touch(Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL);
          }}
          onBlur={() =>
            validationContext.touch(Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL)
          }
          isInvalid={!!optionalityError}
        />
        <FormCheck
          type="switch"
          id={groupedId}
          label="Grouped"
          checked={props.specItem.grouped}
          onChange={(_e) =>
            editingContext.localDispatchFn({
              type: SpecReducerActionType.TOGGLE_SPEC_ITEM_GROUPED,
              payload: props.specItem.id,
            })
          }
          disabled={!props.specItem.optional}
        />
        <ErrorTextComponent errorMessage={optionalityError} />
      </FormGroupRowComponent>
    </VerticalMoveableComponent>
  );
};
