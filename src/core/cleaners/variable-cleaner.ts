import { VariableDTO } from '../../data/model/variable/variable-dto';
import { VariableType } from '../../data/model/variable/variable-types';
import { Cleaner } from './cleaner';

export const getVariableCleaner = (): Cleaner<VariableDTO> => {
  return {
    clean: (variables) =>
      variables.map((variable) => {
        const base = {
          id: variable.id,
          name: variable.name,
          roleKey: variable.roleKey,
          enabled: variable.enabled,
          locked: variable.locked,
        };
        switch (variable.type) {
          case VariableType.Enum.TEXT:
            return {
              ...base,
              type: variable.type,
              defaultValue: variable.defaultValue,
            };
          case VariableType.Enum.RANGE:
            return {
              ...base,
              type: variable.type,
              beginInclusive: variable.beginInclusive,
              endInclusive: variable.endInclusive,
              defaultValue: variable.defaultValue,
            };
          case VariableType.Enum.CHOICE:
            return {
              ...base,
              type: variable.type,
              items: variable.items.map((item) => ({
                id: item.id,
                selectorId: item.selectorId,
                value: item.value,
              })),
              defaultValue: variable.defaultValue,
            };
        }
      }),
  };
};