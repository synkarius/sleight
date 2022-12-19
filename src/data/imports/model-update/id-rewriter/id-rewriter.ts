import { SleightDataInternalFormat } from '../../../data-formats';
import { Ided } from '../../../model/domain';
import { reduceIded } from '../reduce-ided';

export type IdRewriter = {
  rewriteId: (
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export const replaceIdInSlice = <E extends Ided>(
  oldId: string,
  newId: string,
  slice: Record<string, E>
): Record<string, E> => {
  return Object.values(slice)
    .map((ided) => {
      if (ided.id === oldId) {
        return {
          ...ided,
          id: newId,
        };
      }
      return ided;
    })
    .reduce(reduceIded, {});
};
