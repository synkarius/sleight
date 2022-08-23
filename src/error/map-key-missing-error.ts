import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class MapKeyMissingError extends SleightError {
  constructor(key: string) {
    super(ErrorCode.MAP_KEY_MISSING, 'map key is missing: ' + key);
  }
}
