import { SleightDataInternalFormat } from '../../../data-formats';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class SpecIdRewriter implements IdRewriter<SpecDTO> {
  rewriteId(
    spec: SpecDTO,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      specs: replaceIdInSlice(spec, newId, data.specs),
    };
  }
}
