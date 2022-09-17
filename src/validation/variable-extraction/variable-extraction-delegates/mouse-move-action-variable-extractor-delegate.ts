import {
  isMouseAction,
  isMoveMouseAction,
} from '../../../data/model/action/mouse/mouse';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getMouseMoveVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isMouseAction(action) && isMoveMouseAction(action)) {
        return [
          {
            ...action.x,
            field: Field.AC_MOUSE_X_VAR,
          },
          {
            ...action.y,
            field: Field.AC_MOUSE_Y_VAR,
          },
        ];
      }
    },
  });
