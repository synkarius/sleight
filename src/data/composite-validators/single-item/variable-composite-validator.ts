import { FieldValidator } from '../../../validation/field-validator';
import { Variable } from '../../model/variable/variable';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class VariableCompositeValidator extends AbstractSingleItemCompositeValidator<Variable> {
  constructor(private validators: FieldValidator<Variable>[]) {
    super();
  }

  getValidators(): FieldValidator<Variable>[] {
    return this.validators;
  }
}

// export class VariablesSleightDataValidator extends SleightDataValidationResultHandler {
//   constructor(
//     private variableValidators: FieldValidator<Variable>[],
//     private variableMapper: VariableDomainMapper
//   ) {
//     super();
//   }

//   getUnaggregatedResults(
//     data: SleightDataInternalFormat
//   ): CompositeValidationResult[] {
//     return Object.values(data.variables)
//       .map((variableDTO) =>
//         this.variableMapper.mapToDomain(variableDTO, data.selectors)
//       )
//       .flatMap((variable) =>
//         this.variableValidators
//           .filter((v) => v.isApplicable(variable))
//           .filter(not(isDeletionValidator))
//           .map((v) => this.convertResult(variable, v.validate(variable, data)))
//       );
//   }
// }
