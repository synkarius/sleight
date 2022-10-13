export enum ErrorCode {
  EXHAUSTIVENESS_FAILURE = 'this error can never happen at runtime',

  EXPORT = 'problem occurred during export',

  MAP_KEY_MISSING = 'map key not found',

  MISSING_DELEGATE = 'missing delegate',

  MISSING_GUARD = 'missing guard',

  MODEL_UPDATE_EVALUATION_FAILURE = 'model update evaluation failed',

  NOT_IMPLEMENTED = 'method not implemented',

  ROLE_KEY_NOT_FOUND = 'role key not found',

  WRONG_TYPE_FAILURE = 'wrong type: this error should never happen at runtime',
}
