import { Text } from './text/text';
import { Range } from './range/range';
import { Choice } from './choice/choice';
import { BasicFields } from '../../domain';
import { getRandomId } from '../../../util/random-id';
import { VariableType } from './variable-types';

export type Variable = Text | Range | Choice;

export const createVariable = (
  type: VariableType.Type
): BasicFields<VariableType.Type> => {
  return {
    id: getRandomId(),
    type: type,
    name: '',
    roleKeyId: null,
  };
};

export const copyVariable = (
  variable: BasicFields<VariableType.Type>
): BasicFields<VariableType.Type> => {
  return {
    roleKeyId: variable.roleKeyId,
    id: variable.id,
    name: variable.name,
    type: variable.type,
  };
};
