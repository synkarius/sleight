import { SleightDataInternalFormat } from '../../../data-formats';
import { Context } from '../../../model/context/context';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class ContextIdRewriter implements IdRewriter<Context> {
  rewriteId(
    context: Context,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      contexts: replaceIdInSlice(context, newId, data.contexts),
    };
  }
}
