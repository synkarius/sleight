import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import {
  ValidationResult,
  ValidationResultType,
} from '../../validation/validation-result';
import { SleightDataInternalFormat } from '../data-formats';
import { Ided } from '../model/domain';

export enum ImportValidationResultType {
  VALID,
  INVALID,
}

type ImportValidResult = {
  status: typeof ImportValidationResultType.VALID;
};

type Invalidated = {
  id: string;
  message: string;
};

type ImportInvalidResult = {
  status: typeof ImportValidationResultType.INVALID;
  invalidated: Invalidated[];
};

export type ImportValidationResult = ImportValidResult | ImportInvalidResult;

/** Fully validates the contents of an imported file. */
export type ImportsValidator = {
  validateImportedData: (
    data: SleightDataInternalFormat
  ) => ImportValidationResult;
};

const rewrap = <T extends Ided>(
  ided: T,
  result: ValidationResult
): ImportValidationResult => {
  switch (result.type) {
    case ValidationResultType.VALID:
      return { status: ImportValidationResultType.VALID };
    default:
      return {
        status: ImportValidationResultType.INVALID,
        invalidated: [
          {
            id: ided.id,
            message: result.message,
          },
        ],
      };
  }
};

export const getImportsValidator = (): ImportsValidator => {
  return {
    validateImportedData: (data) => {
      const injected = getDefaultInjectionContext();
      const validators = injected.validation.validators;
      const specMapper = injected.mappers.spec;
      const variableMapper = injected.mappers.variable;
      const invalidatedResults = [
        ...Object.values(data.actions).flatMap((action) =>
          validators.action.map((v) => rewrap(action, v.validate(action, data)))
        ),
        ...Object.values(data.commands).flatMap((command) =>
          validators.command.map((v) =>
            rewrap(command, v.validate(command, data))
          )
        ),
        ...Object.values(data.contexts).flatMap((context) =>
          validators.context.map((v) =>
            rewrap(context, v.validate(context, data))
          )
        ),
        ...Object.values(data.specs)
          .map((specDTO) => specMapper.mapToDomain(specDTO, data.selectors))
          .flatMap((spec) =>
            validators.spec.map((v) => rewrap(spec, v.validate(spec, data)))
          ),
        ...Object.values(data.variables)
          .map((variableDTO) =>
            variableMapper.mapToDomain(variableDTO, data.selectors)
          )
          .flatMap((variable) =>
            validators.variable.map((v) =>
              rewrap(variable, v.validate(variable, data))
            )
          ),
      ].filter(
        (result): result is ImportInvalidResult =>
          result.status === ImportValidationResultType.INVALID
      );
      if (invalidatedResults.length) {
        return {
          status: ImportValidationResultType.INVALID,
          invalidated: invalidatedResults.flatMap(
            (result) => result.invalidated
          ),
        };
      }

      return {
        status: ImportValidationResultType.VALID,
      };
    },
  };
};
