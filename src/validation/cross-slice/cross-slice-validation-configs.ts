import { ElementType } from '../../features/model/common/element-types';
import { Field } from '../validation-field';
import { ValidationConfig } from './cross-slice-validator-config';
import {
  keyToSendGroup,
  outerPauseGroup,
  innerPauseGroup,
  repeatGroup,
  directionGroup,
} from '../../features/model/action/send-key/send-key-action-value-type-name-groups';

export const specAdequacyConfigForAction: ValidationConfig = {
  touchTriggersValidationFields: [
    ...Object.values(keyToSendGroup),
    ...Object.values(outerPauseGroup),
    ...Object.values(innerPauseGroup),
    ...Object.values(repeatGroup),
    ...Object.values(directionGroup),
    Field.AC_SAVE,
  ],
  editingElementType: ElementType.Enum.ACTION,
};

export const specAdequacyConfigForCommand: ValidationConfig = {
  touchTriggersValidationFields: [
    Field.CMD_SPEC_SPEC_SELECT,
    Field.CMD_ACTION_SELECT,
  ],
  editingElementType: ElementType.Enum.COMMAND,
};

export const specAdequacyConfigForSpec: ValidationConfig = {
  touchTriggersValidationFields: [Field.SP_ITEM_VARIABLE],
  editingElementType: ElementType.Enum.SPEC,
};
