import { createCloneMapper, DomainMapper } from './mapper';
import { Selector } from '../../data/model/selector/selector-domain';
import { SelectorDTO } from '../../data/model/selector/selector-dto';

export const getSelectorDomainMapper: () => DomainMapper<
  Selector,
  SelectorDTO
> = () => createCloneMapper();
