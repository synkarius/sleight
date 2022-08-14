import { createCloneMapper, DomainMapper } from '../../../../data/mapper';
import { Selector } from './selector-domain';
import { SelectorDTO } from './selector-dto';

export const getSelectorDomainMapper: () => DomainMapper<
  Selector,
  SelectorDTO
> = () => createCloneMapper();
