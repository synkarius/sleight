import { Action } from '../../data/model/action/action';
import { IdedAndActionTyped } from './action-default-namer';
import { Namer } from './namer';

export class ActionWizardNamer implements Namer<Action> {
  constructor(private defaultActionNamer: Namer<IdedAndActionTyped>) {}

  getName(action: Action): string {
    const unique = this.defaultActionNamer.getName(action);
    return `WG Action / ${unique}`;
  }
}
