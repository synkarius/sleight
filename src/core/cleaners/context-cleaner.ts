import { Context } from '../../data/model/context/context';
import { DomainMapper } from '../mappers/mapper';
import { Cleaner } from './cleaner';

/** Already have mappers, so cleaning data by mapping back and forth.
 * Should replace with better data cleaner.
 * TODO
 */
export class ContextMappingCleaner implements Cleaner<Context> {
  constructor(private contextMapper: DomainMapper<Context, Context>) {}

  clean(contexts: Readonly<Context[]>): Context[] {
    return contexts
      .map((contextDTO) => this.contextMapper.mapToDomain(contextDTO))
      .map((context) => this.contextMapper.mapFromDomain(context));
  }
}
