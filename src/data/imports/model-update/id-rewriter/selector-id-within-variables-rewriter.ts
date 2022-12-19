import { SleightDataInternalFormat } from '../../../data-formats';
import { isChoiceVariableDTO } from '../../../model/variable/variable-dto';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export class SelectorIdWithinVariablesIdRewriter implements IdRewriter {
  rewriteId(oldId: string, newId: string, data: SleightDataInternalFormat) {
    const variables = Object.values(data.variables)
      .map((variable) => {
        if (isChoiceVariableDTO(variable)) {
          return {
            ...variable,
            items: variable.items.map((item) => {
              if (item.selectorId === oldId) {
                return {
                  ...item,
                  selectorId: newId,
                };
              }
              return item;
            }),
          };
        }
        return variable;
      })
      .reduce(reduceIded, {});

    return { ...data, variables };
  }
}
