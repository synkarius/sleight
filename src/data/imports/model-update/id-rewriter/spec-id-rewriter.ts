import { SpecDTO } from '../../../model/spec/spec-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export const getSpecIdRewriter = (): IdRewriter<SpecDTO> => ({
  rewriteId: (spec, newId, data) => {
    return {
      ...data,
      specs: replaceIdInSlice(spec, newId, data.specs),
    };
  },
});
