import { FieldValidator } from '../../../validation/field-validator';
import { Spec } from '../../model/spec/spec-domain';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class SpecCompositeValidator extends AbstractSingleItemCompositeValidator<Spec> {
  constructor(private validators: FieldValidator<Spec>[]) {
    super();
  }

  getValidators(): FieldValidator<Spec>[] {
    return this.validators;
  }
}

// export class SpecsSleightDataValidator extends SleightDataValidationResultHandler {
//   constructor(
//     private specValidators: FieldValidator<Spec>[],
//     private specMapper: SpecDomainMapper
//   ) {
//     super();
//   }

//   getUnaggregatedResults(
//     data: SleightDataInternalFormat
//   ): CompositeValidationResult[] {
//     return Object.values(data.specs)
//       .map((specDTO) => this.specMapper.mapToDomain(specDTO, data.selectors))
//       .flatMap((spec) =>
//         this.specValidators
//           .filter((v) => v.isApplicable(spec))
//           .filter(not(isDeletionValidator))
//           .map((v) => this.convertResult(spec, v.validate(spec, data)))
//       );
//   }
// }
