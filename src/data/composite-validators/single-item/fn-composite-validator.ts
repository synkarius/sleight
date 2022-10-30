import { FieldValidator } from '../../../validation/field-validator';
import { Fn } from '../../model/fn/fn';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class FnCompositeValidator extends AbstractSingleItemCompositeValidator<Fn> {
  constructor(private validators: FieldValidator<Fn>[]) {
    super();
  }

  getValidators(): FieldValidator<Fn>[] {
    return this.validators;
  }
}
