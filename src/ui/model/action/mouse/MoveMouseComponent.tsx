import React, { useContext } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormText,
  Row,
} from 'react-bootstrap';
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
import { processErrorResults } from '../../../../validation/validation-result-processing';

const AC_MOUSE_X = Field.AC_MOUSE_X;
const AC_MOUSE_Y = Field.AC_MOUSE_Y;

const getLocationDescriptionText = (mma: MoveMouseAction): string => {
  switch (mma.mouseMovementType) {
    case MouseMovementType.Enum.ABSOLUTE:
      return 'pixel distance from the upper left corner of the screen';
    case MouseMovementType.Enum.RELATIVE:
      return "pixel distance from the cursor's current position";
    case MouseMovementType.Enum.WINDOW:
      return 'percentage across the current window';
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
  const xChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_X,
      payload: +event.target.value,
    });
  };
  const yChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    editingContext.localDispatch({
      type: ActionReducerActionType.CHANGE_MOUSE_MOVEMENT_Y,
      payload: +event.target.value,
    });
  };

  const errorResult = processErrorResults(validationContext.getErrorResults());

  const isWindowMovement =
    props.moveMouseAction.mouseMovementType === MouseMovementType.Enum.WINDOW;

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
      <FormGroup as={Row} className="mb-3">
        <Col sm="6">
          <FormControl
            type="number"
            value={props.moveMouseAction.x}
            min={isWindowMovement ? 0 : undefined}
            max={isWindowMovement ? 1 : undefined}
            step={isWindowMovement ? 0.01 : undefined}
            onChange={xChangedHandler}
            onBlur={() => validationContext.touch(AC_MOUSE_X)}
            isInvalid={!!errorResult([AC_MOUSE_X])}
            name={Field[AC_MOUSE_X]}
            aria-label={Field[AC_MOUSE_X]}
          />
          <FormText className="text-muted">x value</FormText>
        </Col>
        <Col sm="6">
          <FormControl
            type="number"
            value={props.moveMouseAction.y}
            min={isWindowMovement ? 0 : undefined}
            max={isWindowMovement ? 1 : undefined}
            step={isWindowMovement ? 0.01 : undefined}
            onChange={yChangedHandler}
            onBlur={() => validationContext.touch(AC_MOUSE_Y)}
            isInvalid={!!errorResult([AC_MOUSE_Y])}
            name={Field[AC_MOUSE_Y]}
            aria-label={Field[AC_MOUSE_Y]}
          />
          <FormText className="text-muted">y value</FormText>
        </Col>
        <FormText className="text-muted">
          {getLocationDescriptionText(props.moveMouseAction)}
        </FormText>
      </FormGroup>
    </>
  );
};
