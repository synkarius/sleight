import { FieldValidator } from '../../../validation/field-validator';
import { Action } from '../../model/action/action';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class ActionCompositeValidator extends AbstractSingleItemCompositeValidator<Action> {
  constructor(private validators: FieldValidator<Action>[]) {
    super();
  }

  getValidators(): FieldValidator<Action>[] {
    return this.validators;
  }
}
