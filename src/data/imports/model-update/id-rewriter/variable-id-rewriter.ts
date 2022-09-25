import { VariableDTO } from '../../../model/variable/variable-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export const getVariableIdRewriter = (): IdRewriter<VariableDTO> => ({
  rewriteId: (variable, newId, data) => {
    return {
      ...data,
      variables: replaceIdInSlice(variable, newId, data.variables),
    };
  },
});
