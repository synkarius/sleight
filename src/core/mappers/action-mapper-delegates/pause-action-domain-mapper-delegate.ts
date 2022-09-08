import { ActionType } from '../../../data/model/action/action-types';
import { getAbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { getNumericActionValueDomainMapper } from './action-value-mapper/numeric-action-value-domain-mapper';

export const getPauseDomainMapperDelegate = (): ActionDomainMapperDelegate => {
  const abstractDelegate = getAbstractActionDomainMapperDelegate();
  const numericActionValueMapper = getNumericActionValueDomainMapper();
  return {
    mapToDomain: (dto) => {
      if (dto.type === ActionType.Enum.PAUSE) {
        return {
          ...abstractDelegate.mapToDomain(dto),
          type: dto.type,
          centiseconds: numericActionValueMapper.mapToDomain(dto.centiseconds),
        };
      }
    },
    mapFromDomain: (domain) => {
      if (domain.type === ActionType.Enum.PAUSE) {
        return {
          ...abstractDelegate.mapFromDomain(domain),
          type: domain.type,
          centiseconds: numericActionValueMapper.mapFromDomain(
            domain.centiseconds
          ),
        };
      }
    },
  };
};
