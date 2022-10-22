import { isSendTextAction } from '../../../data/model/action/send-text/send-text';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getSendTextVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractActionValues: (action) => {
      if (isSendTextAction(action)) {
        return [
          {
            ...action.text,
            field: Field.AC_ST_TEXT_VAR,
          },
        ];
      }
    },
  });
