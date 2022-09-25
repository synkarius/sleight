import { SleightDataInternalFormat } from '../../../data-formats';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class VariableIdRewriter implements IdRewriter<VariableDTO> {
  rewriteId(
    variable: VariableDTO,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      variables: replaceIdInSlice(variable, newId, data.variables),
    };
  }
}
