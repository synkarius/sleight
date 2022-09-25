import { VariableDTO } from '../../data/model/variable/variable-dto';
import { VariableType } from '../../data/model/variable/variable-types';
import { Cleaner } from './cleaner';

export class DefaultVariableCleaner implements Cleaner<VariableDTO> {
  clean(variables: Readonly<VariableDTO[]>): VariableDTO[] {
    return variables.map((variable) => {
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
        case VariableType.Enum.NUMBER:
          return {
            ...base,
            type: variable.type,
            beginInclusive: variable.beginInclusive,
            endInclusive: variable.endInclusive,
            defaultValue: variable.defaultValue,
          };
        case VariableType.Enum.ENUM:
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
    });
  }
}
