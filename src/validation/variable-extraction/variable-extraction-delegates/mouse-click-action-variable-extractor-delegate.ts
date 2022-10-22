import {
  isClickMouseAction,
  isMouseAction,
} from '../../../data/model/action/mouse/mouse';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getMouseClickVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractActionValues: (action) => {
      if (isMouseAction(action) && isClickMouseAction(action)) {
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
            ...action.repeat,
            field: Field.AC_MOUSE_REPEAT_VAR,
          },
        ];
      }
    },
  });
