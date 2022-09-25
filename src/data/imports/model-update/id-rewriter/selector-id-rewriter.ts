import { SelectorDTO } from '../../../model/selector/selector-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export const getSelectorIdRewriter = (): IdRewriter<SelectorDTO> => ({
  rewriteId: (selector, newId, data) => {
    return {
      ...data,
      selectors: replaceIdInSlice(selector, newId, data.selectors),
    };
  },
});
