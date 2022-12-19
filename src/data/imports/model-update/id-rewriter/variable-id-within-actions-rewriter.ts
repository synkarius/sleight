import { isDefined } from '../../../../core/common/common-functions';
import { MissingDelegateError } from '../../../../error/missing-delegate-error';
import { SleightDataInternalFormat } from '../../../data-formats';
import { reduceIded } from '../reduce-ided';
import { ActionVariableIdsRewriterDelegate } from './action-variable-ids-rewriter-delegate/action-variable-ids-rewriter-delegate';
import { IdRewriter } from './id-rewriter';

/** Rewrites a variable's id within actions which use that variable. */
export class VariableIdWithinActionsRewriter implements IdRewriter {
  constructor(private delegates: ActionVariableIdsRewriterDelegate[]) {}
  rewriteId(oldId: string, newId: string, data: SleightDataInternalFormat) {
    const actions = Object.values(data.actions)
      .map((action) => {
        const delegate = this.delegates
          .filter((delegate) => delegate.isApplicable(action))
          .find(isDefined);
        if (!delegate) {
          throw new MissingDelegateError('VariableIdWithinActionsRewriter');
        }

        const rewritten = delegate.rewriteId(oldId, newId, action);
        if (rewritten) {
          return rewritten;
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
