import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../../../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../../../../test/utils/action-types-provider-util';
import {
  createSleightDataInternalFormat,
  SleightDataInternalFormat,
} from '../../../../data-formats';
import { createTextVariable } from '../../../../model/variable/variable';
import { reduceIded } from '../../reduce-ided';

describe('action variable ids rewriter delegation tests', () => {
  it('all action types should be covered by variable ids rewriter delegates', () => {
    const idRewriter = container.get(Tokens.VariableIdWithinActionsRewriter);

    // create test data
    const data: SleightDataInternalFormat = {
      ...createSleightDataInternalFormat(),
      actions: getTestActionsForAllActionTypes().reduce(reduceIded, {}),
    };
    const variable = createTextVariable();

    // test delegates
    try {
      idRewriter.rewriteId(variable.id, 'asdf', data);
    } catch (e: unknown) {
      if (e instanceof MissingDelegateError) {
        throw e;
      }
    }
  });
});
