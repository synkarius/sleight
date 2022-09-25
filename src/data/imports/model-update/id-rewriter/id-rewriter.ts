import { SleightDataInternalFormat } from '../../../data-formats';
import { Ided } from '../../../model/domain';
import { reduceIded } from '../reduce-ided';

export type IdRewriter<E extends Ided> = {
  rewriteId: (
    ided: E,
    newId: string,
    data: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export const replaceIdInSlice = <E extends Ided>(
  ided: E,
  newId: string,
  slice: Record<string, E>
): Record<string, E> => {
  const oldId = ided.id;
  const removed = Object.values(slice)
    .filter((i) => i.id !== oldId)
    .reduce(reduceIded, {});
  const newIded = { ...ided, id: newId };

  return { ...removed, [newId]: newIded };
};
