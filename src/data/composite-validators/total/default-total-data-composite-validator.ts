import { DomainMapper } from '../../../core/mappers/mapper';
import { SpecDomainMapper } from '../../../core/mappers/spec-domain-mapper';
import { VariableDomainMapper } from '../../../core/mappers/variable-domain-mapper';
import { SleightDataInternalFormat } from '../../data-formats';
import { Action } from '../../model/action/action';
import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { Fn } from '../../model/fn/fn';
import { Spec } from '../../model/spec/spec-domain';
import { Variable } from '../../model/variable/variable';
import { CompositeValidationResult } from '../composite-validation-result';
import { aggregateInvalidResults } from '../composite-validation-utils';
import { SingleItemCompositeValidator } from '../single-item/single-item-composite-validator';
import { TotalDataCompositeValidator } from './total-data-composite-validator';

/**
 * Validates the entire Sleight Data object.
 * Runs ALL validators, through delegates.
 */
export class DefaultTotalCompositeValidator
  implements TotalDataCompositeValidator
{
  constructor(
    private actionsValidator: SingleItemCompositeValidator<Action>,
    private commandsValidator: SingleItemCompositeValidator<Command>,
    private contextsValidator: SingleItemCompositeValidator<Context>,
    private fnsValidator: SingleItemCompositeValidator<Fn>,
    private specValidator: SingleItemCompositeValidator<Spec>,
    private variableValidator: SingleItemCompositeValidator<Variable>,
    private actionMapper: DomainMapper<Action, Action>,
    private commandMapper: DomainMapper<Command, Command>,
    private contextMapper: DomainMapper<Context, Context>,
    private fnMapper: DomainMapper<Fn, Fn>,
    private specMapper: SpecDomainMapper,
    private variableMapper: VariableDomainMapper
  ) {}

  validateSleightData(
    data: SleightDataInternalFormat
  ): CompositeValidationResult {
    const actionResults = Object.values(data.actions)
      .map((action) => this.actionMapper.mapToDomain(action))
      .map((action) => this.actionsValidator.validateSingle(action, data));
    const commandResults = Object.values(data.commands)
      .map((command) => this.commandMapper.mapToDomain(command))
      .map((commands) => this.commandsValidator.validateSingle(commands, data));
    const contextResults = Object.values(data.contexts)
      .map((context) => this.contextMapper.mapToDomain(context))
      .map((context) => this.contextsValidator.validateSingle(context, data));
    const fnResults = Object.values(data.fns)
      .map((fn) => this.fnMapper.mapToDomain(fn))
      .map((fn) => this.fnsValidator.validateSingle(fn, data));
    const specResults = Object.values(data.specs)
      .map((specDTO) => this.specMapper.mapToDomain(specDTO, data.selectors))
      .map((spec) => this.specValidator.validateSingle(spec, data));
    const variableResults = Object.values(data.variables)
      .map((variableDTO) =>
        this.variableMapper.mapToDomain(variableDTO, data.selectors)
      )
      .map((variable) => this.variableValidator.validateSingle(variable, data));
    return aggregateInvalidResults([
      ...actionResults,
      ...commandResults,
      ...contextResults,
      ...fnResults,
      ...specResults,
      ...variableResults,
    ]);
  }
}
