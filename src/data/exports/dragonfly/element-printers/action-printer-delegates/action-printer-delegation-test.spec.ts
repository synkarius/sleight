import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { ExportError } from '../../../../../error/export-error';
import { MapKeyMissingError } from '../../../../../error/map-key-missing-error';
import { MissingDelegateError } from '../../../../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../../../../test/utils/action-types-provider-util';
import { createSleightDataInternalFormat } from '../../../../data-formats';

describe('action printer delegation tests', () => {
  it('all actions should be covered by action printer delegates', () => {
    const actionPrinter = container.get(Tokens.DragonElementPrinter_Action);
    const data = createSleightDataInternalFormat();
    getTestActionsForAllActionTypes().map((action) => {
      try {
        actionPrinter.printElement(action, data);
      } catch (e: unknown) {
        if (e instanceof MissingDelegateError) {
          throw e;
        }
      }
    });
  });
});
