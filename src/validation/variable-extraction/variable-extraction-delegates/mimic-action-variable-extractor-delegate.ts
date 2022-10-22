import { isMimicAction } from '../../../data/model/action/mimic/mimic';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getMimicVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractActionValues: (action) => {
      if (isMimicAction(action)) {
        return [
          {
            ...action.words,
            field: Field.AC_MIMIC_WORDS_VAR,
          },
        ];
      }
    },
  });
