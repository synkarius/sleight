import { createCloneMapper } from './mapper';
import { RangeVariable } from '../../data/model/variable/variable';

export const getRangeVariableDomainMapper = () =>
  createCloneMapper<RangeVariable>();
