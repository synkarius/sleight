import { Ided, Typed } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';
import { VariableType } from '../../data/model/variable/variable-types';

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
