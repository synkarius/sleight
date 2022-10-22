import { Action } from '../../../../model/action/action';
import { ActionValue } from '../../../../model/action/action-value';
import { ActionValueType } from '../../../../model/action/action-value-type';

export type ActionVariableIdsRewriterDelegate = {
  rewriteId: (
    oldId: string,
    newId: string,
    action: Action
  ) => Action | undefined;
  isApplicable: (action: Action) => boolean;
};

export const maybeRewriteVariableId = <T extends ActionValue>(
  actionValue: T,
  oldVariableId: string,
  newVariableId: string
): T => {
  if (actionValue.actionValueType === ActionValueType.Enum.USE_VARIABLE) {
    const variableId =
      actionValue.variableId === oldVariableId
        ? newVariableId
        : actionValue.variableId;
    return { ...actionValue, variableId };
  }
  return actionValue;
};
