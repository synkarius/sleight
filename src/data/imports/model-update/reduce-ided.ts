import { Ided } from '../../model/domain';

export const reduceIded = <T extends Ided>(
  record: Record<string, T>,
  ided: T
) => ({
  ...record,
  [ided.id]: ided,
});
