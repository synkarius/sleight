import { Context } from '../../../model/context/context';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export const getContextIdRewriter = (): IdRewriter<Context> => ({
  rewriteId: (context, newId, data) => {
    return {
      ...data,
      contexts: replaceIdInSlice(context, newId, data.contexts),
    };
  },
});
