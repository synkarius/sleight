import { Modifiers } from '../../../data/model/action/send-key/send-key';
import { DomainMapper } from '../mapper';

export class SendKeyModifiersDomainMapper
  implements DomainMapper<Modifiers, Modifiers>
{
  mapToDomain(dto: Modifiers) {
    return {
      control: dto.control,
      alt: dto.alt,
      shift: dto.shift,
      windows: dto.windows,
    };
  }
  mapFromDomain(domain: Modifiers) {
    return {
      control: domain.control,
      alt: domain.alt,
      shift: domain.shift,
      windows: domain.windows,
    };
  }
}

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
