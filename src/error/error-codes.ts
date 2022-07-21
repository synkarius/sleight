export enum ErrorCode {
  IMPROPER_CONTEXT_USAGE = 'do not use default context impl - provide values to context provider in JSX instead',

  NOT_EDITING_AN_ACTION = 'not editing an action',
  NOT_IMPLEMENTED = 'method not implemented',

  SELECTOR_ID_ALREADY_IN_USE = 'selector id already in use',
  SELECTOR_ID_NOT_FOUND = 'selector id not found',

  UNHANDLED_ACTION_EDITING_EVENT_TYPE = 'unhandled action editing event type',
  UNHANDLED_ACTION_TYPE = 'unhandled action type',
  UNHANDLED_ACTION_VALUE_OPERATION = 'unhandled action value operation',
  UNHANDLED_ACTION_VALUE_TYPE = 'unhandled action value type',
  UNHANDLED_ROLE_KEY_EDITING_EVENT_TYPE = 'unhandled role key editing event type',
  UNHANDLED_SPEC_ITEM_TYPE = 'unhandled spec item type',
  UNHANDLED_SEND_KEY_FIELD = 'unhandled send key field',
  UNHANDLED_SEND_KEY_MODE = 'unhandled send key mode',
  UNHANDLED_SEND_KEY_MODIFIER_TYPE = 'unhandled send key modifier type',
  UNHANDLED_VARIABLE_TYPE = 'unhandled variable type',
}
