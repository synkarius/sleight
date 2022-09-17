import { ElementType } from '../../data/model/element-types';
import { Field } from '../validation-field';
import { ValidationConfig } from './cross-slice-validator-config';
import {
  skKeyToSendGroup,
  skOuterPauseGroup,
  skInnerPauseGroup,
  skRepeatGroup,
  skDirectionGroup,
} from '../../ui/model/action/send-key/send-key-action-value-field-groups';

export const specAdequacyConfigForAction: ValidationConfig = {
  touchTriggersValidationFields: [
    ...Object.values(skKeyToSendGroup),
    ...Object.values(skOuterPauseGroup),
    ...Object.values(skInnerPauseGroup),
    ...Object.values(skRepeatGroup),
    ...Object.values(skDirectionGroup),
    Field.AC_SAVE,
  ],
  editingElementType: ElementType.Enum.ACTION,
};

export const specAdequacyConfigForCommand: ValidationConfig = {
  touchTriggersValidationFields: [
    Field.CMD_SPEC_SELECT,
    Field.CMD_ACTION_SELECT,
  ],
  editingElementType: ElementType.Enum.COMMAND,
};

export const specAdequacyConfigForSpec: ValidationConfig = {
  touchTriggersValidationFields: [Field.SP_ITEM_VARIABLE],
  editingElementType: ElementType.Enum.SPEC,
};

export const optionalityConfigForSpec: ValidationConfig = {
  touchTriggersValidationFields: [
    Field.SP_ITEM_VARIABLE,
    Field.SP_TOGGLE_SPEC_ITEM_OPTIONAL,
  ],
  editingElementType: ElementType.Enum.SPEC,
};

export const optionalityConfigForVariable: ValidationConfig = {
  touchTriggersValidationFields: [Field.VAR_USE_DEFAULT],
  editingElementType: ElementType.Enum.VARIABLE,
};
