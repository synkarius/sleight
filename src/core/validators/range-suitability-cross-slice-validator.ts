import { Action } from '../../data/model/action/action';
import { ElementType } from '../../data/model/element-types';
import { isRangeVariable, Variable } from '../../data/model/variable/variable';
import { VariableDTO } from '../../data/model/variable/variable-dto';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';
import {
  getRangeSuitabilityConfigForAction,
  rangeSuitabilityConfigForVariable,
} from '../../validation/cross-slice/cross-slice-validation-configs';
import {
  createCrossSliceValidator,
  CrossSliceValidateFunction,
} from '../../validation/cross-slice/cross-slice-validator-factory';
import {
  actionDataCopierFn,
  variableDataCopierFn,
} from '../../validation/cross-slice/data-copier-fns';
import { givenVariableFindActions } from '../../validation/cross-slice/finder-fns';
import { FieldValidator } from '../../validation/field-validator';
import { ValidationErrorCode } from '../../validation/validation-error-code';
import { Field } from '../../validation/validation-field';
import {
  ValidationResultType,
  validResult,
} from '../../validation/validation-result';
import {
  isDefined,
  Predicate,
  singletonArray,
} from '../common/common-functions';
import { FieldMetaDataType } from '../common/field-groups-supplier';
import { MapUtil } from '../common/map-util';
import { isSome } from '../common/maybe';

type RangeSuitabilityProblem = {
  field: Field;
  actionValueId: string;
  action: Action;
  variable: VariableDTO;
};

/**
 * Should not be able to:
 * - choose a var for an AVC (in an action) which has an inappropriate range
 * - change the range of a numeric variable to be inappropriate after it's in use (AT ALL, indiscriminately)
 *    - note that this means changing whether the negative barrier is crossed, not any change at all
 */
const variableRangeSuitabilityValidatorFn: CrossSliceValidateFunction<
  Action
> = (actions, data, config) => {
  const variableExtractor = container.get(Tokens.VariableExtractor);
  const fieldGroupsSupplier = container.get(Tokens.FieldGroupsSupplier);

  //
  const problems: RangeSuitabilityProblem[] = [];
  for (const action of actions) {
    const eActionValues = variableExtractor.extractVariables(action);
    for (const ev of eActionValues) {
      const maybeGroup = fieldGroupsSupplier.getGroupByField(ev.field);
      if (isSome(maybeGroup)) {
        const group = maybeGroup.value;
        if (group.type === FieldMetaDataType.NUMBER && isDefined(group.min)) {
          const variable = MapUtil.getOrThrow(data.variables, ev.variableId);
          if (
            isRangeVariable(variable) &&
            variable.beginInclusive < group.min
          ) {
            // found a violation
            problems.push({
              action,
              variable,
              field: ev.field,
              actionValueId: ev.id,
            });
          }
        }
      }
    }
  }

  if (!!problems.length) {
    switch (config.editingElementType) {
      case ElementType.Enum.ACTION:
        return {
          type: ValidationResultType.FIELDS_AND_IDS,
          errorHighlightFields: problems.map((p) => p.field),
          ids: problems.map((p) => p.variable.id),
          code: ValidationErrorCode.VAR_UNSUITABLE_RANGE,
          message:
            'numeric variables must have an appropriate range' +
            ' for their usage; this variable has a negative minimum',
        };
      case ElementType.Enum.VARIABLE:
        const actions = problems.map((p) => `"${p.action.name}"`).join(', ');
        return {
          type: ValidationResultType.BASIC,
          errorHighlightField: Field.VAR_RANGE_MIN,
          code: ValidationErrorCode.VAR_UNSUITABLE_RANGE,
          message:
            'variables which are in use in actions cannot have their ranges' +
            ` changed; this variable is used in actions: ${actions}`,
        };
      default:
    }
  }
  return validResult(config.touchTriggersValidationFields[0]);
};

const actionApplicability: Predicate<Action> = (action) => {
  const variableExtractor = container.get(Tokens.VariableExtractor);
  return !!variableExtractor.extractVariables(action).length;
};

// range suitability: action side
export const getRangeSuitabilityActionValidator: () => FieldValidator<Action> =
  () =>
    createCrossSliceValidator(
      actionDataCopierFn,
      singletonArray,
      actionApplicability,
      variableRangeSuitabilityValidatorFn,
      getRangeSuitabilityConfigForAction()
    );

// range suitability: variable side
export const getRangeSuitabilityVariableValidator: () => FieldValidator<Variable> =
  () =>
    createCrossSliceValidator(
      variableDataCopierFn,
      givenVariableFindActions,
      actionApplicability,
      variableRangeSuitabilityValidatorFn,
      rangeSuitabilityConfigForVariable
    );
