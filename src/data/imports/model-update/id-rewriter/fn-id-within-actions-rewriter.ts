import { SleightDataInternalFormat } from '../../../data-formats';
import { isCallFunctionAction } from '../../../model/action/call-function/call-function';
import { Fn } from '../../../model/fn/fn';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a fn's id within actions which use that fn. */
export class FnIdWithinActionsRewriter implements IdRewriter<Fn> {
  rewriteId(fn: Fn, newId: string, data: SleightDataInternalFormat) {
    const oldId = fn.id;

    const actions = Object.values(data.actions)
      .map((action) => {
        if (isCallFunctionAction(action) && action.functionId === oldId) {
          return {
            ...action,
            functionId: newId,
          };
        }
        return action;
      })
      .reduce(reduceIded, {});

    return {
      ...data,
      actions,
    };
  }
}
