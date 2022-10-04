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
import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { ActionValueComponent } from '../ActionValueComponent';
import { mMoveXGroup, mMoveYGroup } from './mouse-action-value-field-groups';

enum CoordType {
  X,
  Y,
}

const getLocationDescriptionText = (
  mma: MoveMouseAction,
  ct: CoordType
): string => {
  switch (mma.mouseMovementType) {
    case MouseMovementType.Enum.ABSOLUTE_PIXELS:
      const side = CoordType.X === ct ? 'left' : 'upper';
      return `pixel distance from the ${side} corner of the screen`;
    case MouseMovementType.Enum.RELATIVE_PIXELS:
      const name = CoordType[ct];
      return `pixel distance from the cursor's current ${name} position`;
    case MouseMovementType.Enum.WINDOW_PERCENTAGE:
      const dir = CoordType.X === ct ? 'horizontally' : 'vertically';
      return `percentage across the current window ${dir}`;
    default:
      throw new ExhaustivenessFailureError(mma.mouseMovementType);
  }
};

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
      <ActionValueComponent
        actionValue={props.moveMouseAction.x}
        labelText="X Value"
        descriptionText={getLocationDescriptionText(
          props.moveMouseAction,
          CoordType.X
        )}
        fields={mMoveXGroup}
      />
      <ActionValueComponent
        actionValue={props.moveMouseAction.y}
        labelText="Y Value"
        descriptionText={getLocationDescriptionText(
          props.moveMouseAction,
          CoordType.Y
        )}
        fields={mMoveYGroup}
      />
    </>
  );
};
