import { isPauseAction } from '../../../data/model/action/pause/pause';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getPauseVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractActionValues: (action) => {
      if (isPauseAction(action)) {
        return [
          {
            ...action.centiseconds,
            field: Field.AC_CENTISECONDS_VAR,
          },
        ];
      }
    },
  });
