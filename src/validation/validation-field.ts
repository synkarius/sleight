// TODO: make this a string enum so that all the aria-labels work right with screen readers

export enum Field {
  // action:
  AC_NAME,
  AC_TYPE,
  AC_ROLE_KEY,
  // action: send key :
  AC_SEND_KEY_MODE,
  // action: key to send
  AC_DIRECTION_RADIO,
  AC_DIRECTION_VALUE,
  AC_DIRECTION_VAR,
  AC_DIRECTION_RK,
  // action: inner pause
  AC_INNER_PAUSE_RADIO,
  AC_INNER_PAUSE_VALUE,
  AC_INNER_PAUSE_VAR,
  AC_INNER_PAUSE_RK,
  // action: key to send
  AC_KEY_TO_SEND_RADIO,
  AC_KEY_TO_SEND_VALUE,
  AC_KEY_TO_SEND_VAR,
  AC_KEY_TO_SEND_RK,
  // action: outer pause
  AC_OUTER_PAUSE_RADIO,
  AC_OUTER_PAUSE_VALUE,
  AC_OUTER_PAUSE_VAR,
  AC_OUTER_PAUSE_RK,
  // action: repeat
  AC_REPEAT_RADIO,
  AC_REPEAT_VALUE,
  AC_REPEAT_VAR,
  AC_REPEAT_RK,
  // command:
  CMD_NAME,
  CMD_ROLE_KEY,
  // command: spec
  CMD_SPEC_RADIO,
  CMD_SPEC_VAR,
  CMD_SPEC_RK,
  // context:
  CTX_MATCHER,
  CTX_NAME,
  CTX_ROLE_KEY,
  CTX_TYPE,
  // role key: role key
  RK_ROLE_KEY,
  // spec:
  SP_NAME,
  SP_ROLE_KEY,
  SP_ADD_ITEM_BUTTON,
  SP_ITEM_TYPE_SELECT,
  SP_ITEM_SELECTOR,
  SP_ITEM_VARIABLE,
  // variable:
  VAR_NAME,
  VAR_ROLE_KEY,
  VAR_CHOICE_ITEM_SELECTOR,
}
