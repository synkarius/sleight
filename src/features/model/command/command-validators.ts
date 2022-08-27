import { isSelected } from '../../../util/common-functions';
import {
  createNameTakenValidator,
  createValidator,
  FieldValidator,
  ValidatorType,
} from '../../../validation/field-validator';
import { ValidationErrorCode } from '../../../validation/validation-error-code';
import { Field } from '../../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../../validation/validation-result';
import {
  Command,
  isRoleKeyedSpecCommand,
  isSelectedSpecCommand,
} from './command';

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
  validatorType: ValidatorType.FIELD,
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
  // specsProvideRoledKeyedVariablesToCoverActions,
];
