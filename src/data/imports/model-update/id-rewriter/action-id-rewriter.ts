import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class ActionIdRewriter implements IdRewriter<Action> {
  rewriteId(
    action: Action,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      actions: replaceIdInSlice(action, newId, data.actions),
    };
  }
}
