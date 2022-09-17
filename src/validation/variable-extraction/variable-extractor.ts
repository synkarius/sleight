import { Action } from '../../data/model/action/action';
import {
  EnumActionValue,
  NumericActionValue,
  TextActionValue,
  VariableEnumActionValue,
  VariableRangeActionValue,
  VariableTextActionValue,
} from '../../data/model/action/action-value';
import { Field } from '../validation-field';

type ActionIdData = {
  actionId: string;
};
type FieldData = {
  field: Field;
};
/** action value, action, field */
export type ExtractedActionValue = (
  | TextActionValue
  | NumericActionValue
  | EnumActionValue
) &
  FieldData;
/** variable action value, action field */
export type ExtractedVariable = (
  | VariableTextActionValue
  | VariableRangeActionValue
  | VariableEnumActionValue
) &
  ActionIdData &
  FieldData;

/** Extracts variables from actions, with metadata.
 * User for some validators.
 */
export type VariableExtractor = {
  extractVariables: (action: Action) => ExtractedVariable[];
};
