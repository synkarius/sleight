import { createCloneMapper } from './mapper';
import { TextVariable } from '../../data/model/variable/variable';

export const getTextVariableDomainMapper = () =>
  createCloneMapper<TextVariable>();
