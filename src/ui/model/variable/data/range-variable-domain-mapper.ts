import { createCloneMapper } from '../../../../data/mapper';
import { RangeVariable } from './variable';

export const getRangeVariableDomainMapper = () =>
  createCloneMapper<RangeVariable>();
