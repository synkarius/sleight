import {
  isSendKeyAction,
  isSendKeyPressAction,
} from '../../../data/model/action/send-key/send-key';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getSendKeyPressVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractActionValues: (action) => {
      if (isSendKeyAction(action) && isSendKeyPressAction(action)) {
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
            ...action.innerPause,
            field: Field.AC_SK_INNER_PAUSE_VAR,
          },
          {
            ...action.repeat,
            field: Field.AC_SK_REPEAT_VAR,
          },
        ];
      }
    },
  });
