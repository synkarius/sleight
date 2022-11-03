import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { PauseAction } from '../../../data/model/action/pause/pause';
import { Maybe, none, some } from '../../common/maybe';
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

  mapToDomain(dto: Action): Maybe<PauseAction> {
    if (dto.type === ActionType.Enum.PAUSE) {
      return some({
        ...this.mapToDomainBase(dto),
        type: dto.type,
        centiseconds: this.actionValueMapper.mapToNumberDomain(
          dto.centiseconds
        ),
      });
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<PauseAction> {
    if (domain.type === ActionType.Enum.PAUSE) {
      return some({
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        centiseconds: this.actionValueMapper.mapFromNumberDomain(
          domain.centiseconds
        ),
      });
    }
    return none();
  }
}
