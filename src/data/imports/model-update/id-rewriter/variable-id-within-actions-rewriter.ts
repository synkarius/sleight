import { isDefined } from '../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../data-formats';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { reduceIded } from '../reduce-ided';
import { ActionVariableIdsRewriterDelegate } from './action-variable-ids-rewriter-delegate/action-variable-ids-rewriter-delegate';
import { IdRewriter } from './id-rewriter';

/** Rewrites a variable's id within actions which use that variable. */
export class VariableIdWithinActionsRewriter
  implements IdRewriter<VariableDTO>
{
  constructor(private delegates: ActionVariableIdsRewriterDelegate[]) {}
  rewriteId(
    variable: VariableDTO,
    newId: string,
    data: SleightDataInternalFormat
  ) {
    const oldId = variable.id;

    const actions = Object.values(data.actions)
      .map((action) => {
        const actionWithVariableIdsRewritten = this.delegates
          .map((delegate) => delegate.rewriteId(oldId, newId, action))
          .find(isDefined);
        if (actionWithVariableIdsRewritten) {
          return actionWithVariableIdsRewritten;
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
