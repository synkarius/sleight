import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { ValidationContext } from '../../../../validation/validation-context';
import { Field } from '../../../../validation/validation-field';
import { FormGroupRowComponent } from '../../../other-components/FormGroupRowComponent';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { ClickMouseComponent } from './ClickMouseComponent';
import { HoldReleaseMouseComponent } from './HoldReleaseMouseComponent';
import {
  isClickMouseAction,
  isHoldReleaseMouseAction,
  isMoveMouseAction,
  MouseAction,
} from '../../../../data/model/action/mouse/mouse';
import { MouseActionType } from '../../../../data/model/action/mouse/mouse-action-type';
import { MoveMouseComponent } from './MoveMouseComponent';
import { fieldName } from '../../../../validation/field-name';

export const MouseComponent: React.FC<{ mouseAction: MouseAction }> = (
  props
) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_MOUSE_ACTION_TYPE,
      payload: event.target.value as MouseActionType.Type,
    });
    validationContext.touch(Field.AC_MOUSE_ACTION_TYPE);
  };
  return (
    <>
      <FormGroupRowComponent
        labelText="Mouse Action Type"
        descriptionText="what to do with the mouse"
      >
        <Form.Select
          aria-label={fieldName(Field.AC_MOUSE_ACTION_TYPE)}
          role="list"
          onChange={typeChangedHandler}
          value={props.mouseAction.mouseActionType}
        >
          {MouseActionType.values().map((mat) => (
            <option key={mat} value={mat} role="listitem">
              {mat}
            </option>
          ))}
        </Form.Select>
      </FormGroupRowComponent>
      {isMoveMouseAction(props.mouseAction) && (
        <MoveMouseComponent moveMouseAction={props.mouseAction} />
      )}
      {isClickMouseAction(props.mouseAction) && (
        <ClickMouseComponent clickMouseAction={props.mouseAction} />
      )}
      {isHoldReleaseMouseAction(props.mouseAction) && (
        <HoldReleaseMouseComponent holdReleaseMouseAction={props.mouseAction} />
      )}
    </>
  );
};
