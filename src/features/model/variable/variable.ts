import { Text } from './text/text';
import { Range } from './range/range';
import { Choice } from './choice/choice';
import { BasicFields } from '../../domain';
import { getRandomId } from '../../../util/random-id';

export type Variable = Text | Range | Choice;

export const createVariable = (type: string): BasicFields => {
  return {
    roleKeyId: null,
    id: getRandomId(),
    name: '',
    type: type,
  };
};

export const copyVariable = (variable: BasicFields): BasicFields => {
  return {
    roleKeyId: variable.roleKeyId,
    id: variable.id,
    name: variable.name,
    type: variable.type,
  };
};
