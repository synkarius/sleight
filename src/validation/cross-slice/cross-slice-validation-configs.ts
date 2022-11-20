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
import { groupFieldsOf } from '../../ui/model/action/action-value-type-name-group';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

export const specAdequacyConfigForAction: ValidationConfig = {
  touchTriggersValidationFields: [
    ...groupFieldsOf(skKeyToSendGroup),
    ...groupFieldsOf(skOuterPauseGroup),
    ...groupFieldsOf(skInnerPauseGroup),
    ...groupFieldsOf(skRepeatGroup),
    ...groupFieldsOf(skDirectionGroup),
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

export const getRangeSuitabilityConfigForAction = (): ValidationConfig => {
  // TODO: since this config requires the container
  // and this config thing is a part of an injected thing (a cross slice validator),
  // this config should really be injected with the fieldGroupsSupplier
  // rather than using container.get here
  const fieldGroupsSupplier = container.get(Tokens.FieldGroupsSupplier);
  const variableFields = fieldGroupsSupplier
    .getAllGroups()
    .flatMap((md) => md.fields)
    .filter((field) => Field[field].endsWith('_VAR'));
  return {
    touchTriggersValidationFields: [...variableFields],
    editingElementType: ElementType.Enum.ACTION,
  };
};

export const rangeSuitabilityConfigForVariable: ValidationConfig = {
  touchTriggersValidationFields: [Field.VAR_RANGE_MIN],
  editingElementType: ElementType.Enum.VARIABLE,
};
