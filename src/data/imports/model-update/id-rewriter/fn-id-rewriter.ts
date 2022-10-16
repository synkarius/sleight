import { SleightDataInternalFormat } from '../../../data-formats';
import { Fn } from '../../../model/fn/fn';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class FnIdRewriter implements IdRewriter<Fn> {
  rewriteId(
    fn: Fn,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      fns: replaceIdInSlice(fn, newId, data.fns),
    };
  }
}
