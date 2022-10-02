import { MapUtil } from '../../../../../core/common/map-util';
import { ExhaustivenessFailureError } from '../../../../../error/exhaustiveness-failure-error';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { ActionValue } from '../../../../model/action/action-value';
import { ActionValueType } from '../../../../model/action/action-value-type';
import { VariableType } from '../../../../model/variable/variable-types';
import {
  DragonflyActionValueResolverResult,
  DragonflyActionValueResolverResultType,
} from './dragonfly-action-value-resolver-result';

/** Turns action values into a format which is easier
 * to work with for printing.
 */
export type DragonflyActionValueResolver = {
  resolve: (
    actionValue: ActionValue,
    data: SleightDataInternalFormat
  ) => DragonflyActionValueResolverResult;
};

export class DefaultDragonflyActionValueResolver
  implements DragonflyActionValueResolver
{
  resolve(
    actionValue: ActionValue,
    data: SleightDataInternalFormat
  ): DragonflyActionValueResolverResult {
    const actionValueType = actionValue.actionValueType;
    switch (actionValueType) {
      case ActionValueType.Enum.ENTER_VALUE:
        const enteredValueType = actionValue.enteredValueType;
        switch (enteredValueType) {
          case VariableType.Enum.TEXT:
            return {
              type: DragonflyActionValueResolverResultType.ENTER_TEXT,
              value: actionValue.value,
            };
          case VariableType.Enum.NUMBER:
            return {
              type: DragonflyActionValueResolverResultType.ENTER_NUMBER,
              value: actionValue.value + '',
            };
          case VariableType.Enum.ENUM:
            return {
              type: DragonflyActionValueResolverResultType.ENTER_ENUM,
              value: actionValue.value,
            };
          default:
            throw new ExhaustivenessFailureError(enteredValueType);
        }
      case ActionValueType.Enum.USE_VARIABLE:
        const variable = MapUtil.getOrThrow(
          data.variables,
          actionValue.variableId
        );
        return {
          type: DragonflyActionValueResolverResultType.USE_VARIABLE,
          value: variable.name,
        };
      default:
        throw new ExhaustivenessFailureError(actionValueType);
    }
  }
}
