import { NumericActionValue } from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';

export const limitNumericActionValueToPercentage = (
  actionValue: NumericActionValue
): NumericActionValue => {
  if (actionValue.actionValueType === ActionValueType.Enum.ENTER_VALUE) {
    return {
      ...actionValue,
      value: Math.max(0, Math.min(100, actionValue.value)),
    };
  }
  return actionValue;
};
