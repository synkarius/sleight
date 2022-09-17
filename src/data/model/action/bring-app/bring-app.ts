import {
  AbstractAction,
  copyAction,
  createAbstractAction,
} from '../abstract-action';
import { Action } from '../action';
import { ActionType } from '../action-types';
import { createEnumValue, EnumActionValue } from '../action-value';

export interface BringAppAction extends AbstractAction {
  type: typeof ActionType.Enum.BRING_APP;
  appPath: EnumActionValue;
  appTitle: EnumActionValue;
  startDir: EnumActionValue;
}

export const isBringAppAction = (action: Action): action is BringAppAction =>
  action.type === ActionType.Enum.BRING_APP;

export const createBringAppAction = (): BringAppAction => ({
  ...createAbstractAction(),
  type: ActionType.Enum.BRING_APP,
  appPath: createEnumValue(),
  appTitle: createEnumValue(),
  startDir: createEnumValue(),
});

export const copyIntoBringAppAction = (action: Action): BringAppAction => ({
  ...copyAction(action),
  type: ActionType.Enum.BRING_APP,
  appPath: createEnumValue(),
  appTitle: createEnumValue(),
  startDir: createEnumValue(),
});
