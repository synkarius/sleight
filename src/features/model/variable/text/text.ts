import { getRandomId } from '../../../../util/random-id';
import { RoleKeyed, Ided, Named, Typed, BasicFields } from '../../../domain';
import { copyVariable } from '../variable';
import { VariableType } from '../variable-types';

export interface Text extends RoleKeyed, Named, Ided, Typed<VariableType.Type> {
  readonly type: typeof VariableType.Enum.TEXT;
}

export const createText = (): Text => {
  return {
    id: getRandomId(),
    type: VariableType.Enum.TEXT,
    name: '',
    roleKeyId: null,
  };
};

export const copyIntoText = (
  variable: BasicFields<VariableType.Type>
): Text => {
  return {
    ...copyVariable(variable),
    type: VariableType.Enum.TEXT,
  };
};
