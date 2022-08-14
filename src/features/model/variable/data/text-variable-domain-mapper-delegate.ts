import { createCloneMapper } from '../../../../data/mapper';
import { TextVariable } from './variable';

export const getTextVariableDomainMapper = () =>
  createCloneMapper<TextVariable>();
