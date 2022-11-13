import { isSome, maybe } from '../core/common/maybe';
import { MissingFieldError } from '../error/missing-field-error';
import { Field } from './validation-field';

const tokenMap = new Map<string, string>();
tokenMap.set('AC', 'action');
tokenMap.set('VAR', 'variable');
tokenMap.set('DIR', 'directory');
tokenMap.set('FN', 'function');
tokenMap.set('FUNC', 'function');
tokenMap.set('SK', 'send key');
tokenMap.set('ST', 'send text');
tokenMap.set('WFW', 'wait for window');
tokenMap.set('CMD', 'command');
tokenMap.set('CTX', 'context');
tokenMap.set('PREFS', 'preferences');
tokenMap.set('SP', 'spec');
tokenMap.set('MIN', 'minimum');
tokenMap.set('MAX', 'maximum');
tokenMap.set('WIZ', 'wizard');
tokenMap.set('MC', 'mouse click');

const calculateNames = (): Map<Field, string> => {
  const result = new Map<Field, string>();
  const fields = Object.keys(Field)
    .filter((i) => !isNaN(Number(i)))
    .map((field) => +field);
  for (const field of fields) {
    const tokens: string = Field[field]
      .split('_')
      .map((token) => {
        const maybeReplace = maybe(tokenMap.get(token));
        return isSome(maybeReplace) ? maybeReplace.value : token.toLowerCase();
      })
      .join(' ');
    result.set(field, tokens);
  }

  return result;
};

const names = calculateNames();

/** accesses a constant pre-computed map of unique field names */
export const fieldName = (field: Field): string => {
  const maybeName = maybe(names.get(field));
  if (isSome(maybeName)) {
    return maybeName.value;
  }
  // this error should never be thrown:
  throw new MissingFieldError(field);
};
