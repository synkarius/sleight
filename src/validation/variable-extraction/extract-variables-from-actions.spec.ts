import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../test/utils/action-types-provider-util';

describe('validation support tests', () => {
  it('all actions should be covered in extract variables fn', () => {
    const extractor = container.get(Tokens.VariableExtractor);
    getTestActionsForAllActionTypes().map((action) => {
      try {
        extractor.extractVariables(action);
      } catch (e: unknown) {
        if (e instanceof MissingDelegateError) {
          throw e;
        }
      }
    });
  });
});
