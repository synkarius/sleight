import { Fn } from '../../data/model/fn/fn';
import { FnType } from '../../data/model/fn/fn-types';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { Cleaner } from './cleaner';

export class DefaultFnCleaner implements Cleaner<Fn> {
  clean(fns: Readonly<Fn[]>): Fn[] {
    return fns.map((fn) => {
      const base = {
        id: fn.id,
        name: fn.name,
        roleKey: fn.roleKey,
        enabled: fn.enabled,
        locked: fn.locked,
      };
      const fnType = fn.type;
      switch (fnType) {
        case FnType.Enum.PYTHON:
          const result: Fn = {
            ...base,
            type: FnType.Enum.PYTHON,
            importTokens: [...fn.importTokens],
            parameters: fn.parameters.map((param) => ({
              id: param.id,
              name: param.name,
              type: param.type,
            })),
          };
          return result;
        default:
          throw new ExhaustivenessFailureError(fnType);
      }
    });
  }
}
