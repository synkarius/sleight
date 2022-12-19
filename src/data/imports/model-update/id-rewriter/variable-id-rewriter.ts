import { SleightDataInternalFormat } from '../../../data-formats';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class VariableIdRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      variables: replaceIdInSlice(oldId, newId, data.variables),
    };
  }
}
