import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class PauseActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action) {
    if (dto.type === ActionType.Enum.PAUSE) {
      return {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        centiseconds: this.actionValueMapper.mapToNumericDomain(
          dto.centiseconds
        ),
      };
    }
  }

  mapFromDomain(domain: Action) {
    if (domain.type === ActionType.Enum.PAUSE) {
      return {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        centiseconds: this.actionValueMapper.mapFromNumericDomain(
          domain.centiseconds
        ),
      };
    }
  }
}
