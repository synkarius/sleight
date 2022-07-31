export enum ErrorCode {
  EXHAUSTIVENESS_FAIURE = 'this error should never happen at runtime',

  IMPROPER_CONTEXT_USAGE = 'do not use default context impl - provide values to context provider in JSX instead',

  NOT_IMPLEMENTED = 'method not implemented',

  SELECTOR_ID_ALREADY_IN_USE = 'selector id already in use',
  SELECTOR_ID_NOT_FOUND = 'selector id not found',

  UNHANDLED_FIELD = 'unhandled field',
}
