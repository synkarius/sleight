import { Action } from '../../../../data/model/action/action';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../../../test/utils/action-types-provider-util';
import { ActionReducerActionType } from '../../../../ui/model/action/action-editing-context';
import {
  ActionValueChangeIdentifierType,
  ActionValueTypeChange,
} from '../../../../ui/model/action/action-editing-context-support';
import { Field } from '../../../../validation/validation-field';
import { ExtractedActionValue } from '../../../../validation/variable-extraction/variable-extractor';
import { isDefined } from '../../../common/common-functions';

/** Each `Testable` is:
 * - an `ActionValue` from one of the `ActionType`s
 * - a `Field` which that action value is related to
 * - the `Action` which the action value came from
 *
 * These 3 things together are enough to construct a payload similar to
 * what the actual React components construct.
 */
type Testable = {
  eav: ExtractedActionValue;
  action: Action;
};

describe('action value updater delegation tests', () => {
  it('test data should be adequate', () => {
    /*
     * The number of payloads created for this test suite should be equal to the number of
     * reducer delegates. If that's true, then the other test(s) are probably reliable.
     * "Probably" rather than "definitely" because of `CallFunctionAction`, which can have
     * a variable number of action values. In `getTestActionsForAllActionTypes`,
     * it has one, but that could get broken in the future.
     */
    const testables = getStandardActionValues();
    const delegates = container.get(Tokens.ActionValueUpdaterDelegates);

    expect(delegates.length).toEqual(testables.length);
  });

  it('all actions should be covered by action value updater delegates', () => {
    const actionValueUpdater = container.get(Tokens.ActionValueUpdater);

    getStandardActionValues().forEach((item) => {
      try {
        actionValueUpdater.update(item.action, {
          type: ActionReducerActionType.CHANGE_ACTION_VALUE_TYPE,
          payload: createPayload(item),
        });
      } catch (e: unknown) {
        if (e instanceof MissingDelegateError) {
          throw e;
        }
      }
    });
  });
});

const getStandardActionValues = (): Testable[] => {
  const extractorDelegates = container.get(Tokens.VariableExtractorDelegates);

  // get all payloads
  const nonUnique = getTestActionsForAllActionTypes().flatMap((action) => {
    const extractedActionValues = extractorDelegates
      .map((delegate) => delegate.extractActionValues(action))
      .find(isDefined);
    if (extractedActionValues) {
      return extractedActionValues.map((extractedActionValue) => ({
        eav: extractedActionValue,
        action,
      }));
    }
    throw new Error('test is invalid');
  });

  // only return unique payloads
  const fields: Set<Field> = new Set();
  const result: Testable[] = [];
  for (const t of nonUnique) {
    if (!fields.has(t.eav.field)) {
      result.push(t);
    }
    fields.add(t.eav.field);
  }

  return result;
};

const createPayload = (testable: Testable): ActionValueTypeChange => {
  return testable.eav.field === Field.AC_CALL_FUNC_PARAMETER_VAR
    ? {
        type: ActionValueChangeIdentifierType.ID,
        id: testable.eav.id,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      }
    : {
        type: ActionValueChangeIdentifierType.FIELD,
        field: testable.eav.field,
        actionValueType: ActionValueType.Enum.ENTER_VALUE,
      };
};
