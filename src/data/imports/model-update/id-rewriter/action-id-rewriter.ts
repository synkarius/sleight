import { SleightDataInternalFormat } from '../../../data-formats';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class ActionIdRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      actions: replaceIdInSlice(oldId, newId, data.actions),
    };
  }
}
