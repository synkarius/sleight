import { SleightDataInternalFormat } from '../../../data-formats';
import { Ided } from '../../../model/domain';

export type IdRewriter<E extends Ided> = {
  rewriteId: (
    ided: E,
    newId: string,
    data: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};
