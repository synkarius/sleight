import { FieldValidator } from '../../../validation/field-validator';
import { Context } from '../../model/context/context';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class ContextCompositeValidator extends AbstractSingleItemCompositeValidator<Context> {
  constructor(private validators: FieldValidator<Context>[]) {
    super();
  }

  getValidators(): FieldValidator<Context>[] {
    return this.validators;
  }
}
