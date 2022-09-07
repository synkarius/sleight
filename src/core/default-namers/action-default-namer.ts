import { Ided, Typed } from '../../data/model/domain';
import { DefaultNamer } from './default-namer';
import { ElementType } from '../../data/model/element-types';
import { ActionType } from '../../data/model/action/action-types';

interface IdedAndTyped extends Ided, Typed<ActionType.Type> {}

export const getDefaultActionNamer: () => DefaultNamer<IdedAndTyped> = () => ({
  getDefaultName: (action) =>
    action.type.toLowerCase().replaceAll(' ', '-') +
    '-' +
    ElementType.Enum.ACTION.toLowerCase().slice(0, 3) +
    '-' +
    action.id.slice(0, 13),
});
