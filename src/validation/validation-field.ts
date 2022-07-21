// TODO: make this a string enum so that all the aria-labels work right with screen readers

export enum Field {
  // for no-validation validator
  NO_OP,
  // action: key to send
  AC_DIRECTION_RADIO,
  AC_DIRECTION_VALUE,
  AC_DIRECTION_VAR,
  AC_DIRECTION_RK,
  // action: inner pause
  AC_INNER_PAUSE_RADIO,
  AC_INNER_PAUSE_VAR,
  AC_INNER_PAUSE_RK,
  // action: key to send
  AC_KEY_TO_SEND_RADIO,
  AC_KEY_TO_SEND_VALUE,
  AC_KEY_TO_SEND_VAR,
  AC_KEY_TO_SEND_RK,
  // action: outer pause
  AC_OUTER_PAUSE_RADIO,
  AC_OUTER_PAUSE_VAR,
  AC_OUTER_PAUSE_RK,
  // action: repeat
  AC_REPEAT_RADIO,
  AC_REPEAT_VAR,
  AC_REPEAT_RK,
  // role key: role key
  RK_ROLE_KEY,
}
