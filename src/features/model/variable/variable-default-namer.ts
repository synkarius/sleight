import { Ided, Typed } from '../../domain';
import { DefaultNamer } from '../common/default-namer';
import { ElementType } from '../common/element-types';
import { VariableType } from './variable-types';

export interface VarIdedAndTyped extends Ided, Typed<VariableType.Type> {}

export const getDefaultVariableNamer: () => DefaultNamer<VarIdedAndTyped> =
  () => ({
    getDefaultName: (variable) =>
      variable.type.toLowerCase() +
      '-' +
      ElementType.Enum.VARIABLE.toLowerCase().slice(0, 3) +
      '-' +
      variable.id.slice(0, 13),
  });
