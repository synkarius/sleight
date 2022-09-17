import { Action } from '../../../data/model/action/action';
import { FieldValidator } from '../../../validation/field-validator';
import { isDefined } from '../../common/common-functions';

export const getCallFunctionValidators: () => FieldValidator<Action>[] = () =>
  [].filter(isDefined);
