import { SleightDataInternalFormat } from '../../../data-formats';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class CommandIdRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      commands: replaceIdInSlice(oldId, newId, data.commands),
    };
  }
}
