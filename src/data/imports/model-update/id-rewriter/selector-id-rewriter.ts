import { SleightDataInternalFormat } from '../../../data-formats';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class SelectorIdRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      selectors: replaceIdInSlice(oldId, newId, data.selectors),
    };
  }
}
