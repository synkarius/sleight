import { SleightDataInternalFormat } from '../../../data-formats';

export type SleightDataEvaluation = {
  needsIdsRewritten: SleightDataInternalFormat;
  roleKeyOverrides: SleightDataInternalFormat;
};
