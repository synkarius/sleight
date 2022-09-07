import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { ValidationContext } from '../../../../validation/validation-context';
import { Field } from '../../../../validation/validation-field';
import { FormGroupRowComponent } from '../../../other-components/FormGroupRowComponent';
import {
  ActionEditingContext,
  ActionReducerActionType,
} from '../action-editing-context';
import { MoveMouseAction } from '../../../../data/model/action/mouse/mouse';
import { MouseMovementType } from '../../../../data/model/action/mouse/mouse-movement-type';

export const MoveMouseComponent: React.FC<{
  moveMouseAction: MoveMouseAction;
}> = (props) => {
  const validationContext = useContext(ValidationContext);
  const editingContext = useContext(ActionEditingContext);

  const typeChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_TYPE,
      payload: event.target.value as MouseMovementType.Type,
    });
    validationContext.touch(Field.AC_MOUSE_MOVEMENT_TYPE);
  };

  return (
    <>
      <FormGroupRowComponent
        labelText="Mouse Movement Type"
        descriptionText="what the x/y numbers mean"
      >
        <Form.Select
          aria-label={Field[Field.AC_MOUSE_MOVEMENT_TYPE]}
          role="list"
          onChange={typeChangedHandler}
          value={props.moveMouseAction.mouseMovementType}
        >
          {MouseMovementType.values().map((mmt) => (
            <option key={mmt} value={mmt} role="listitem">
              {mmt}
            </option>
          ))}
        </Form.Select>
      </FormGroupRowComponent>
    </>
  );
};
