import {
  isSendKeyAction,
  isSendKeyHoldReleaseAction,
} from '../../../data/model/action/send-key/send-key';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getSendKeyHoldReleaseVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isSendKeyAction(action) && isSendKeyHoldReleaseAction(action)) {
        return [
          {
            ...action.keyToSend,
            field: Field.AC_SK_KEY_TO_SEND_VAR,
          },
          {
            ...action.outerPause,
            field: Field.AC_SK_OUTER_PAUSE_VAR,
          },
          {
            ...action.direction,
            field: Field.AC_SK_DIRECTION_VAR,
          },
        ];
      }
    },
  });
