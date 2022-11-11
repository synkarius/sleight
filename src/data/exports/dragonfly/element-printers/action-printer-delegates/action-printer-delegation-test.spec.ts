import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../../../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../../../../test/utils/action-types-provider-util';
import { createSleightDataInternalFormat } from '../../../../data-formats';

describe('action printer delegation tests', () => {
  it('all actions should be covered by action printer delegates', () => {
    const actionPrinter = container.get(Tokens.DragonflyPrinter_Action);
    const data = createSleightDataInternalFormat();
    getTestActionsForAllActionTypes().map((action) => {
      try {
        actionPrinter.printItem(action, data);
      } catch (e: unknown) {
        if (e instanceof MissingDelegateError) {
          throw e;
        }
      }
    });
  });
});
