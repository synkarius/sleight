import { isBringAppAction } from '../../../data/model/action/bring-app/bring-app';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getBringAppVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isBringAppAction(action)) {
        return [
          {
            ...action.appPath,
            field: Field.AC_BRING_PATH_VAR,
          },
          {
            ...action.appTitle,
            field: Field.AC_BRING_TITLE_VAR,
          },
          {
            ...action.startDir,
            field: Field.AC_BRING_START_DIR_VAR,
          },
        ];
      }
    },
  });
