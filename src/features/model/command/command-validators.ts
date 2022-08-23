import { NotImplementedError } from '../../../error/not-implemented-error';
import { isSelected } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  createValidator,
  FieldValidator,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import { Action } from '../action/action';
import { ActionType } from '../action/action-types';
import {
  EnumActionValue,
  isRoleKeyActionValue,
  isVariableActionValue,
  NumericActionValue,
  TextActionValue,
} from '../action/action-value/action-value';
import { SendKeyMode } from '../action/send-key/send-key-modes';
import { SpecItemType } from '../spec/spec-item-type';
import {
  Command,
  isRoleKeyedSpecCommand,
  isSelectedSpecCommand,
} from './command';
import { SpecDTO } from '../spec/data/spec-dto';
import { CrossSliceValidatorConfig } from '../../../validation/cross-slice/cross-slice-validator-config';
import { retainActionsSpecsAndSingleCommand } from '../../../validation/cross-slice/data-transform-fn';
import { ValidateAllFunction } from '../../../validation/cross-slice/validate-all-fn';
import { createCrossSliceValidator } from '../../../validation/cross-slice/cross-slice-validator-factory';
import { MapUtil } from '../../../util/map-util';

const nameTakenValidator = createNameTakenValidator<Command, Command>(
  Field.CMD_NAME,
  (data) => data.commands,
  'a command already exists with this name',
  ValidationErrorCode.CMD_NAME_TAKEN
);

const commandSpecVariableSelectedValidator: FieldValidator<Command> =
  createValidator(
    Field.CMD_SPEC_SPEC_SELECT,
    isSelectedSpecCommand,
    (command) => isSelectedSpecCommand(command) && isSelected(command.specId),
    ValidationErrorCode.CMD_SPEC_VAR_NOT_SELECTED,
    'spec variable must be selected'
  );

const CMD_SPEC_RK_SELECT = Field.CMD_SPEC_RK_SELECT;

const commandSpecRoleKeySelectedValidator: FieldValidator<Command> =
  createValidator(
    CMD_SPEC_RK_SELECT,
    isRoleKeyedSpecCommand,
    (command) =>
      isRoleKeyedSpecCommand(command) && isSelected(command.specRoleKeyId),
    ValidationErrorCode.CMD_SPEC_RK_NOT_SELECTED,
    'spec role key must be selected'
  );

const commmandSpecRoleKeyExistenceValidator: FieldValidator<Command> = {
  field: CMD_SPEC_RK_SELECT,
  isApplicable: isRoleKeyedSpecCommand,
  validate: (command, data) => {
    if (
      isRoleKeyedSpecCommand(command) &&
      !Object.values(data.specs).find(
        (spec) => spec.roleKeyId === command.specRoleKeyId
      )
    ) {
      return {
        type: ValidationResultType.BASIC,
        field: CMD_SPEC_RK_SELECT,
        code: ValidationErrorCode.CMD_SPEC_RK_NOT_EXISTS,
        message: 'spec does not exist for role key',
      };
    }
    return validResult(CMD_SPEC_RK_SELECT);
  },
};

const extractVariablesFromAction = (
  action: Action
): (TextActionValue | NumericActionValue | EnumActionValue)[] => {
  const results: (TextActionValue | NumericActionValue | EnumActionValue)[] =
    [];
  switch (action.type) {
    case ActionType.Enum.PAUSE:
      results.push(action.centiseconds);
      break;
    case ActionType.Enum.SEND_KEY:
      results.push(action.keyToSend);
      results.push(action.outerPause);
      if (action.sendKeyMode === SendKeyMode.Enum.PRESS) {
        results.push(action.innerPause);
        results.push(action.repeat);
      } else {
        results.push(action.direction);
      }
      break;
    default:
      throw new NotImplementedError('extractVariablesFromAction');
  }
  return results;
};

const CMD_SAVE = Field.CMD_SAVE;
const specsProvideVariablesToCoverActionsConfig: CrossSliceValidatorConfig<Command> =
  {
    field: CMD_SAVE,
    isApplicable: (command) => isSelectedSpecCommand(command),
    dataTransformFn: retainActionsSpecsAndSingleCommand,
    sliceSpecificErrorMessage:
      "actions' variables are inadequately covered by spec",
  };
const specsProvideVariablesToCoverActionsFn: ValidateAllFunction = (data) => {
  const invalidCommand = Object.values(data.commands).find((command) => {
    if (isSelectedSpecCommand(command)) {
      const variablesInActions = command.actionIds
        .map((actionId) => MapUtil.getOrThrow(data.actions, actionId))
        .flatMap(extractVariablesFromAction)
        .filter(isVariableActionValue)
        .map((actionValue) => actionValue.variableId);
      if (data.specs[command.specId]) {
        const variablesInSpec = data.specs[command.specId].items
          .filter((item) => item.itemType === SpecItemType.Enum.VARIABLE)
          .map((specItem) => specItem.itemId);
        const specDoesntCoverActions = !!variablesInActions.find(
          (variableId) => !variablesInSpec.includes(variableId)
        );
        return specDoesntCoverActions;
      }
      // TODO: this `true` is the result of the spec not being found, which should never happen
      // -- should use something other than Record for map access
      return true;
    }
  });
  return !invalidCommand
    ? validResult(CMD_SAVE)
    : {
        type: ValidationResultType.BASIC,
        field: CMD_SAVE,
        code: ValidationErrorCode.CMD_INADEQUATE_VAR_COVERAGE,
        message: "actions' variables are inadequately covered by spec",
      };
};
const specsProvideVariablesToCoverActions = createCrossSliceValidator(
  specsProvideVariablesToCoverActionsConfig,
  specsProvideVariablesToCoverActionsFn
);

/**
 * This validator is probably complete, but not including it until role key design
 * problems are worked out.
 */
// const specsProvideRoledKeyedVariablesToCoverActions: FieldValidator<Command> = {
//   field: CMD_SAVE,
//   isApplicable: (command) => isRoleKeyedSpecCommand(command),
//   validate: (command, data) => {
//     if (isRoleKeyedSpecCommand(command)) {
//       const variablesInActions = command.actionIds
//         .map((actionId) => data.actions[actionId])
//         .flatMap(extractVariablesFromAction)
//         .filter(isVariableActionValue)
//         .map((actionValue) => actionValue.variableId);
//       if (data.roleKeys[command.specRoleKeyId]) {
//         const roleKeyForSpec = data.roleKeys[command.specRoleKeyId];
//         // TODO: filter for only exported role keys here
//         const variablesInSpec = Object.values(data.specs)
//           .filter((spec) => spec.roleKeyId === roleKeyForSpec.id)
//           .flatMap((spec) => spec.items)
//           .filter((item) => item.itemType === SpecItemType.Enum.VARIABLE)
//           .map((specItem) => specItem.itemId);
//         const specDoesntCoverActions = !!variablesInActions.find(
//           (variableId) => !variablesInSpec.includes(variableId)
//         );
//         if (specDoesntCoverActions) {
//           return {
//             type: ValidationResultType.BASIC,
//             field: CMD_SAVE,
//             code: ValidationErrorCode.CMD_INADEQUATE_RK_VAR_COVERAGE,
//             message:
//               "actions' role keys' variables are inadequately covered by spec",
//           };
//         }
//       }
//     }
//     return validResult(CMD_SAVE);
//   },
// };

export const getCommandValidators: () => FieldValidator<Command>[] = () => [
  nameTakenValidator,
  commandSpecVariableSelectedValidator,
  commandSpecRoleKeySelectedValidator,
  commmandSpecRoleKeyExistenceValidator,
  specsProvideVariablesToCoverActions,
  // specsProvideRoledKeyedVariablesToCoverActions,
];
