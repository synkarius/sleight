import { Ided } from '../data/model/domain';
import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

/** During an import, if a deserialized element evaluates to
 * "override", must have a role key. Therefore, this error should
 * never be thrown.
 *
 * Might be nice to encode that in the type system somehow, but
 * for now, just leaving it like this.
 */
export class MissingRoleKeyError extends SleightError {
  constructor(ided: Ided) {
    super(ErrorCode.ROLE_KEY_NOT_FOUND, 'Role key missing for id: ' + ided.id);
  }
}
