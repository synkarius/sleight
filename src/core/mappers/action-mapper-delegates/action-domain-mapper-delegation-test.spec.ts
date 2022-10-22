import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { MissingDelegateError } from '../../../error/missing-delegate-error';
import { getTestActionsForAllActionTypes } from '../../../test/utils/action-types-provider-util';

describe('action domain mapper delegation tests', () => {
  it('all action types should be covered by action domain mapper delegates', () => {
    const actionMapper = container.get(Tokens.DomainMapper_Action);
    getTestActionsForAllActionTypes().map((action) => {
      try {
        const dto = actionMapper.mapToDomain(action);
        actionMapper.mapFromDomain(dto);
      } catch (e: unknown) {
        if (e instanceof MissingDelegateError) {
          throw e;
        }
      }
    });
  });
});
