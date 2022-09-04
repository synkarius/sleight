import { Ided, Typed } from '../../domain';
import { DefaultNamer } from '../../../common/default-namer';
import { ElementType } from '../../../common/element-types';
import { ActionType } from './action-types';

interface IdedAndTyped extends Ided, Typed<ActionType.Type> {}

export const getDefaultActionNamer: () => DefaultNamer<IdedAndTyped> = () => ({
  getDefaultName: (action) =>
    action.type.toLowerCase().replaceAll(' ', '-') +
    '-' +
    ElementType.Enum.ACTION.toLowerCase().slice(0, 3) +
    '-' +
    action.id.slice(0, 13),
});
