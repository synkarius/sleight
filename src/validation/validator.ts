export interface Validator<T, E> {
  test: (t: T) => boolean;
  error: E;
}

export const validate = <T, E>(
  t: T,
  validator: Validator<T, E>,
  errors: E[]
): void => {
  if (validator.test(t)) {
    while (errors.includes(validator.error)) {
      const index = errors.indexOf(validator.error);
      errors.splice(index, 1);
    }
  } else {
    if (!errors.includes(validator.error)) {
      errors.push(validator.error);
    }
  }
};
