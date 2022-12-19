import { SleightDataInternalFormat } from '../../../data-formats';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class SpecIdRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      specs: replaceIdInSlice(oldId, newId, data.specs),
    };
  }
}
