import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class ActionIdRewriter implements IdRewriter<Action> {
  constructor(private commandActionIdsRewriter: IdRewriter<Action>) {}

  rewriteId(
    action: Action,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    const withCommandsRewritten = this.commandActionIdsRewriter.rewriteId(
      action,
      newId,
      data
    );
    return {
      ...withCommandsRewritten,
      actions: replaceIdInSlice(action, newId, data.actions),
    };
  }
}
