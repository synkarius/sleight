import {
  isHoldReleaseMouseAction,
  isMouseAction,
} from '../../../data/model/action/mouse/mouse';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getMouseHoldReleaseVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isMouseAction(action) && isHoldReleaseMouseAction(action)) {
        return [
          {
            ...action.mouseButton,
            field: Field.AC_MOUSE_MOUSE_BUTTON_VAR,
          },
          {
            ...action.pause,
            field: Field.AC_MOUSE_PAUSE_VAR,
          },
          {
            ...action.direction,
            field: Field.AC_MOUSE_DIRECTION_VAR,
          },
        ];
      }
    },
  });
