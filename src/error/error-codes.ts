export enum ErrorCode {
  EXHAUSTIVENESS_FAILURE = 'this error can never happen at runtime',

  MAP_KEY_MISSING = 'map key not found',

  MISSING_DELEGATE = 'missing delegate',

  NOT_IMPLEMENTED = 'method not implemented',

  WRONG_TYPE_FAILURE = 'wrong type: this error should never happen at runtime',
}
