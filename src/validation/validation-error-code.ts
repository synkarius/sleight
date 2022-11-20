// put an enum-like here
export enum ValidationErrorCode {
  AC_RK_TAKEN,
  AC_AV_EMPTY,
  AC_AV_VAR_NOT_SELECTED,
  AC_USED_AND_DELETE_ATTEMPTED,
  AC_FN_NOT_SELECTED,
  AC_FN_VAR_NOT_SELECTED,
  CMD_RK_TAKEN,
  CMD_SPEC_VAR_NOT_SELECTED,
  CMD_SPEC_NOT_UNIQUE,
  CMD_INADEQUATE_VAR_COVERAGE,
  CTX_RK_TAKEN,
  CTX_MATCHER_EMPTY,
  CTX_USED_AND_DELETE_ATTEMPTED,
  FN_NAME_EMPTY,
  FN_NAME_STARTS_NUM,
  FN_RK_TAKEN,
  FN_NAME_INVALID_CHARS,
  FN_INVALID_IMPORT_PATH,
  FN_PARAM_NAME_EMPTY,
  FN_PARAM_STARTS_NUM,
  FN_USED_FN_TYPE_CHANGED,
  FN_USED_CHANGED_NUM_PARAMS,
  FN_USED_CHANGED_PARAM_TYPE,
  FN_USED_CHANGED_PARAM_ORDER,
  FN_USED_AND_DELETE_ATTEMPTED,
  PREFS_NEGATIVIZER_EMPTY,
  PREFS_NEGATIVIZER_INVALID_CHARS,
  SP_RK_TAKEN,
  SP_EMPTY_SELECTOR,
  SP_VAR_NOT_SELECTED,
  SP_VAR_NON_ALPHASPACE_SELECTOR,
  SP_GTE1_SPEC_ITEM,
  SP_GTE1_NON_OPTIONAL_SPEC_ITEM,
  SP_OPTIONALITY,
  SP_UNIQUENESS,
  SP_USED_AND_DELETE_ATTEMPTED,
  VAR_MIN_GT_MAX,
  VAR_GTE1_CHOICE_ITEM,
  VAR_EMPTY_SELECTOR,
  VAR_NON_ALPHASPACE_SELECTOR,
  VAR_RK_TAKEN,
  VAR_UNSUITABLE_RANGE,
  VAR_USED_BUT_TYPE_CHANGED,
  VAR_USED_AND_DELETE_ATTEMPTED,
  WIZ_CTX_INVALID,
  WIZ_SP_INVALID,
  WIZ_TXT_INVALID,
  WIZ_AC_INVALID,
}
