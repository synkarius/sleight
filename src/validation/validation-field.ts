// TODO: make this a string enum so that all the aria-labels work right with screen readers

export enum Field {
  // action:
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
  CMD_ROLE_KEY,
  // command: spec
  CMD_SPEC_RADIO,
  CMD_SPEC_VAR,
  CMD_SPEC_RK,
  // context:
  CTX_ROLE_KEY,
  // role key: role key
  RK_ROLE_KEY,
  // spec:
  SP_ROLE_KEY,
  // variable:
  VAR_ROLE_KEY,
}
