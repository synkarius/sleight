import { Container } from 'brandi';
import {
  getCrossSliceActionValidators,
  getCrossSliceCommandValidators,
  getCrossSliceContextValidators,
  getCrossSliceSpecValidators,
  getCrossSliceVariableValidators,
} from '../../../validation/cross-slice/cross-slice-validation-fns';
import { getActionValidators } from '../../../core/validators/action-validators';
import { getBringAppValidators } from '../../../core/validators/action/bring-app-validators';
import { getCallFunctionValidators } from '../../../core/validators/action/call-function-validators';
import { getMimicValidators } from '../../../core/validators/action/mimic-validators';
import { getMouseValidators } from '../../../core/validators/action/mouse-validators';
import { getPauseValidators } from '../../../core/validators/action/pause-validators';
import { getSendKeyValidators } from '../../../core/validators/action/send-key-validators';
import { getSendTextValidators } from '../../../core/validators/action/send-text-validators';
import { getWaitForWindowValidators } from '../../../core/validators/action/wait-for-window-validators';
import { getCommandValidators } from '../../../core/validators/command-validators';
import { getContextValidators } from '../../../core/validators/context-validators';
import { getSpecValidators } from '../../../core/validators/spec-validators';
import { getVariableValidators } from '../../../core/validators/variable-validators';
import { Tokens } from '../brandi-tokens';

export const bindValidators = (container: Container): void => {
  // action validators
  container
    .bind(Tokens.Validators_Action)
    .toConstant([
      ...getActionValidators(),
      ...getCallFunctionValidators(),
      ...getBringAppValidators(),
      ...getMimicValidators(),
      ...getMouseValidators(),
      ...getPauseValidators(),
      ...getSendKeyValidators(),
      ...getSendTextValidators(),
      ...getWaitForWindowValidators(),
      ...getCrossSliceActionValidators(),
    ]);
  // command validators
  container
    .bind(Tokens.Validators_Command)
    .toConstant([
      ...getCommandValidators(),
      ...getCrossSliceCommandValidators(),
    ]);
  // context validators
  container
    .bind(Tokens.Validators_Context)
    .toConstant([
      ...getContextValidators(),
      ...getCrossSliceContextValidators(),
    ]);
  // fn validators
  container.bind(Tokens.Validators_Fn).toConstant([]); // TODO
  // spec validators
  container
    .bind(Tokens.Validators_Spec)
    .toConstant([...getSpecValidators(), ...getCrossSliceSpecValidators()]);
  // variable validators
  container
    .bind(Tokens.Validators_Variable)
    .toConstant([
      ...getVariableValidators(),
      ...getCrossSliceVariableValidators(),
    ]);
};
