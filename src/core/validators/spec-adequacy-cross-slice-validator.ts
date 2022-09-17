import { SleightDataInternalFormat } from '../../data/data-formats';
import {
  isIdSelected,
  Predicate,
  singletonArray,
} from '../common/common-functions';
import { MapUtil } from '../common/map-util';
import {
  specAdequacyConfigForAction,
  specAdequacyConfigForCommand,
  specAdequacyConfigForSpec,
} from '../../validation/cross-slice/cross-slice-validation-configs';
import { ValidationConfig } from '../../validation/cross-slice/cross-slice-validator-config';
import {
  createCrossSliceValidator,
  ValidatorFn,
} from '../../validation/cross-slice/cross-slice-validator-factory';
import {
  actionDataCopierFn,
  commandDataCopierFn,
  specDataCopierFn,
} from '../../validation/cross-slice/data-copier-fns';
import {
  givenActionFindCommands,
  givenSpecFindCommands,
} from '../../validation/cross-slice/finder-fns';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  ValidationResult,
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import { Action } from '../../data/model/action/action';
import { ElementType } from '../../data/model/element-types';
import { Spec } from '../../data/model/spec/spec-domain';
import { SpecItemType } from '../../data/model/spec/spec-item-type';
import { VariableDTO } from '../../data/model/variable/variable-dto';
import { Command } from '../../data/model/command/command';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';

type ActionAndField = {
  actionId: string;
  field: Field;
};
type NonCoveredVariable = Pick<VariableDTO, 'id' | 'name'> & ActionAndField;

const specsProvideVariablesToCoverActionsValidatorFn: ValidatorFn<Command> = (
  commands: Command[],
  data: SleightDataInternalFormat,
  config: ValidationConfig
): ValidationResult => {
  const injected = getDefaultInjectionContext();
  const extractor = injected.validation.variableExtractor;
  for (const command of commands) {
    const spec = MapUtil.getOrThrow(data.specs, command.specId);
    const variablesInSpec = spec.items
      .filter((item) => item.itemType === SpecItemType.Enum.VARIABLE)
      .map((specItem) => specItem.itemId)
      .filter(isIdSelected)
      .map((variableId) => MapUtil.getOrThrow(data.variables, variableId));

    const variableActionValuesInActions = command.actionIds
      .filter(isIdSelected)
      .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
      .flatMap(extractor.extractVariables);

    // get variables which are in the command's actions but not its specs
    const noncoveredVariables: NonCoveredVariable[] =
      variableActionValuesInActions
        .filter((vav) => isIdSelected(vav.variableId))
        .filter((vav) => {
          return !variablesInSpec
            .map((variable) => variable.id)
            .includes(vav.variableId);
        })
        .map((vav): NonCoveredVariable => {
          const variable = MapUtil.getOrThrow(data.variables, vav.variableId);
          return {
            ...variable,
            actionId: vav.actionId,
            field: vav.field,
          };
        });

    if (noncoveredVariables.length > 0) {
      const noncoveredActionNames = Array.from(
        new Set(noncoveredVariables.map((v) => v.actionId))
      )
        .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
        .map((action) => action.name)
        .join('", "');
      const noncoveredVariableNames = Array.from(
        new Set(noncoveredVariables.map((v) => v.name))
      ).join('", "');

      switch (config.editingElementType) {
        case ElementType.Enum.ACTION:
          return {
            /*
             * On the action editor screen, we highlight cases where there are
             * variables used which aren't in the spec.
             */
            errorHighlightFields: noncoveredVariables.map((v) => v.field),
            type: ValidationResultType.MULTI_FIELD,
            code: ValidationErrorCode.CMD_INADEQUATE_VAR_COVERAGE,
            message:
              `this action is used in the command "${command.name}" which, due to` +
              ` spec "${spec.name}" would have inadeque variable coverage of the following` +
              ` variables in this state: "${noncoveredVariableNames}"`,
            ids: noncoveredVariables.map((v) => v.id),
          };
        case ElementType.Enum.COMMAND:
          return {
            /*
             * On the command editor screen, we highlight actions which have
             * variables not covered by the spec.
             */
            errorHighlightFields: [Field.CMD_ACTION_SELECT],
            type: ValidationResultType.MULTI_FIELD,
            code: ValidationErrorCode.CMD_INADEQUATE_VAR_COVERAGE,
            message:
              `this command's spec ("${spec.name}") does not provide variables adequate` +
              ` to cover some of its actions ("${noncoveredActionNames}"); specifically ` +
              ` missing variables: "${noncoveredVariableNames}"`,
            ids: noncoveredVariables.map((v) => v.actionId),
          };
        case ElementType.Enum.SPEC:
          return {
            /**
             * On the spec editor screen, there's no way to highlight _which_ spec item is
             * missing
             */
            field: Field.SP_SAVE,
            type: ValidationResultType.BASIC,
            code: ValidationErrorCode.CMD_INADEQUATE_VAR_COVERAGE,
            message:
              `this spec is used in the command "${command.name}" in which it` +
              ` would have inadequate spec-action coverage in this state, due to the` +
              ` following variables: "${noncoveredVariableNames}"; these variables` +
              ` are used in the actions: "${noncoveredActionNames}"`,
          };
        default:
      }
    }
  }

  return validResult(config.touchTriggersValidationFields[0]);
};

const commandRequiresSpecAdequacyValidation: Predicate<Command> = (
  command: Command
) => isIdSelected(command.specId);

// spec-action adequacy: action side
export const getActionSideSpecAdequacyValidator: () => FieldValidator<Action> =
  () =>
    createCrossSliceValidator(
      actionDataCopierFn,
      givenActionFindCommands,
      commandRequiresSpecAdequacyValidation,
      specsProvideVariablesToCoverActionsValidatorFn,
      specAdequacyConfigForAction
    );
// spec-action adequacy: command side
export const getCommandSideSpecAdequacyValidator: () => FieldValidator<Command> =
  () =>
    createCrossSliceValidator(
      commandDataCopierFn,
      singletonArray,
      commandRequiresSpecAdequacyValidation,
      specsProvideVariablesToCoverActionsValidatorFn,
      specAdequacyConfigForCommand
    );
// spec-action adequacy: spec side
export const getSpecSideSpecAdequacyValidator: () => FieldValidator<Spec> =
  () =>
    createCrossSliceValidator(
      specDataCopierFn,
      givenSpecFindCommands,
      commandRequiresSpecAdequacyValidation,
      specsProvideVariablesToCoverActionsValidatorFn,
      specAdequacyConfigForSpec
    );
