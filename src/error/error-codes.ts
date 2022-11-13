export enum ErrorCode {
  EXHAUSTIVENESS_FAILURE = 'this error can never happen at runtime',

  EXPORT = 'problem occurred during export',

  MISSING_DELEGATE = 'missing delegate',

  MISSING_FIELD = 'field not found',

  MISSING_GUARD = 'missing guard',

  MISSING_MAP_KEY = 'map key not found',

  MODEL_UPDATE_EVALUATION_FAILURE = 'model update evaluation failed',

  NOT_IMPLEMENTED = 'method not implemented',

  ROLE_KEY_NOT_FOUND = 'role key not found',

  WRONG_TYPE_FAILURE = 'wrong type: this error should never happen at runtime',
}
