import { ErrorCode } from './error-codes';
import { SleightError } from './sleight-error';

export class MapKeyMissingError extends SleightError {
  constructor(key: string) {
    super(ErrorCode.MISSING_MAP_KEY, 'map key is missing: ' + key);
  }
}
