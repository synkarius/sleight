export enum ErrorCode {
  EXHAUSTIVENESS_FAILURE = 'this error can never happen at runtime',

  WRONG_TYPE_FAILURE = 'wrong type: this error should never happen at runtime',

  NOT_IMPLEMENTED = 'method not implemented',

  UNHANDLED_FIELD = 'unhandled field',
}
