import { SleightDataInternalFormat } from '../../../data-formats';
import { SelectorDTO } from '../../../model/selector/selector-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class SelectorIdRewriter implements IdRewriter<SelectorDTO> {
  rewriteId(
    selector: SelectorDTO,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      selectors: replaceIdInSlice(selector, newId, data.selectors),
    };
  }
}
