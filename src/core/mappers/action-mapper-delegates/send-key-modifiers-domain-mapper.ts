import { Modifiers } from '../../../data/model/action/send-key/send-key';
import { DomainMapper } from '../mapper';

export const getSendKeyModifiersDomainMapper = (): DomainMapper<
  Modifiers,
  Modifiers
> => ({
  mapToDomain: (dto) => ({
    control: dto.control,
    alt: dto.alt,
    shift: dto.shift,
    windows: dto.windows,
  }),
  mapFromDomain: (domain) => ({
    control: domain.control,
    alt: domain.alt,
    shift: domain.shift,
    windows: domain.windows,
  }),
});
