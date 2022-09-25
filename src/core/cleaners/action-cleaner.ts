import { Action } from '../../data/model/action/action';
import { DomainMapper } from '../mappers/mapper';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export class ActionMappingCleaner implements Cleaner<Action> {
  constructor(private actionMapper: DomainMapper<Action, Action>) {}

  clean(actions: Readonly<Action[]>): Action[] {
    return actions
      .map((actionDTO) => this.actionMapper.mapToDomain(actionDTO))
      .map((action) => this.actionMapper.mapFromDomain(action));
  }
}
