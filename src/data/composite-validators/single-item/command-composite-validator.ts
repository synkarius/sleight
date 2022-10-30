import { FieldValidator } from '../../../validation/field-validator';
import { Command } from '../../model/command/command';
import { AbstractSingleItemCompositeValidator } from './abstract-single-item-composite-validator';

export class CommandCompositeValidator extends AbstractSingleItemCompositeValidator<Command> {
  constructor(private validators: FieldValidator<Command>[]) {
    super();
  }

  getValidators(): FieldValidator<Command>[] {
    return this.validators;
  }
}
