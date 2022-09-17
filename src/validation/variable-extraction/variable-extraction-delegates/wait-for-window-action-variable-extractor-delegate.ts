import { isWaitForWindowAction } from '../../../data/model/action/wait-for-window/wait-for-window';
import { Field } from '../../validation-field';
import { VariableExtractorDelegate } from '../variable-extractor-delegate';

export const getWaitForWindowVariableExtractorDelegate =
  (): VariableExtractorDelegate => ({
    extractVariables: (action) => {
      if (isWaitForWindowAction(action)) {
        return [
          {
            ...action.executable,
            field: Field.AC_WFW_EXECUTABLE_VAR,
          },
          {
            ...action.title,
            field: Field.AC_WFW_TITLE_VAR,
          },
          {
            ...action.waitSeconds,
            field: Field.AC_WFW_WAIT_SECONDS_VAR,
          },
        ];
      }
    },
  });
