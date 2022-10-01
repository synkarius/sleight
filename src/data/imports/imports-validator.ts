import { not } from '../../core/common/common-functions';
import { SpecDomainMapper } from '../../core/mappers/spec-domain-mapper';
import { VariableDomainMapper } from '../../core/mappers/variable-domain-mapper';
import {
  FieldValidator,
  isDeletionValidator,
} from '../../validation/field-validator';
import {
  ValidationResult,
  ValidationResultType,
} from '../../validation/validation-result';
import { SleightDataInternalFormat } from '../data-formats';
import { Action } from '../model/action/action';
import { Command } from '../model/command/command';
import { Context } from '../model/context/context';
import { Ided } from '../model/domain';
import { Spec } from '../model/spec/spec-domain';
import { Variable } from '../model/variable/variable';

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

export class DefaultImportsValidator implements ImportsValidator {
  constructor(
    private actionValidators: FieldValidator<Action>[],
    private commandValidators: FieldValidator<Command>[],
    private contextValidators: FieldValidator<Context>[],
    private specValidators: FieldValidator<Spec>[],
    private variableValidators: FieldValidator<Variable>[],
    private specMapper: SpecDomainMapper,
    private variableMapper: VariableDomainMapper
  ) {}

  validateImportedData(
    data: SleightDataInternalFormat
  ): ImportValidationResult {
    const actionResults = Object.values(data.actions).flatMap((action) =>
      this.actionValidators
        .filter((v) => v.isApplicable(action))
        .filter(not(isDeletionValidator))
        .map((v) => this.rewrap(action, v.validate(action, data)))
    );
    const commandResults = Object.values(data.commands).flatMap((command) =>
      this.commandValidators
        .filter((v) => v.isApplicable(command))
        .filter(not(isDeletionValidator))
        .map((v) => this.rewrap(command, v.validate(command, data)))
    );
    const contextResults = Object.values(data.contexts).flatMap((context) =>
      this.contextValidators
        .filter((v) => v.isApplicable(context))
        .filter(not(isDeletionValidator))
        .map((v) => this.rewrap(context, v.validate(context, data)))
    );
    const specResults = Object.values(data.specs)
      .map((specDTO) => this.specMapper.mapToDomain(specDTO, data.selectors))
      .flatMap((spec) =>
        this.specValidators
          .filter((v) => v.isApplicable(spec))
          .filter(not(isDeletionValidator))
          .map((v) => this.rewrap(spec, v.validate(spec, data)))
      );
    const variableResults = Object.values(data.variables)
      .map((variableDTO) =>
        this.variableMapper.mapToDomain(variableDTO, data.selectors)
      )
      .flatMap((variable) =>
        this.variableValidators
          .filter((v) => v.isApplicable(variable))
          .filter(not(isDeletionValidator))
          .map((v) => this.rewrap(variable, v.validate(variable, data)))
      );

    const invalidatedResults = [
      ...actionResults,
      ...commandResults,
      ...contextResults,
      ...specResults,
      ...variableResults,
    ].filter(
      (result): result is ImportInvalidResult =>
        result.status === ImportValidationResultType.INVALID
    );
    if (invalidatedResults.length) {
      return {
        status: ImportValidationResultType.INVALID,
        invalidated: invalidatedResults.flatMap((result) => result.invalidated),
      };
    }

    return {
      status: ImportValidationResultType.VALID,
    };
  }

  rewrap<T extends Ided>(
    ided: T,
    result: ValidationResult
  ): ImportValidationResult {
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
  }
}
