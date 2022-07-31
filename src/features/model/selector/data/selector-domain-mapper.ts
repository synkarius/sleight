import { createCloneMapper, DomainMapper } from '../../../../data/mapper';
import { Selector } from './selector-domain';
import { SelectorRedux } from './selector-redux';

export const selectorDomainMapper: DomainMapper<Selector, SelectorRedux> =
  createCloneMapper();
