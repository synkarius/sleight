import { container } from '../../../../../di/config/brandi-config';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { ExportError } from '../../../../../error/export-error';
import { getTestActionsForAllActionTypes } from '../../../../../test/utils/action-types-provider-util';
import { createSleightDataInternalFormat } from '../../../../data-formats';

/**
 kinds of delegates
====================
action types
===
printer
mapper
reducer
id rewriter
variable extractor
action value reducer delegate -- requires a payload per case, skipped

===
element types
===
id rewriter
mapper

 */
describe('action printer delegation tests', () => {
  it('all actions should be covered by action printer delegates', () => {
    const actionPrinter = container.get(Tokens.DragonElementPrinter_Action);
    const data = createSleightDataInternalFormat();
    getTestActionsForAllActionTypes().map((action) => {
      try {
        actionPrinter.printElement(action, data);
      } catch (e: unknown) {
        if (e instanceof ExportError) {
          // pass, don't care about these
        } else {
          throw e;
        }
      }
    });
  });
});
