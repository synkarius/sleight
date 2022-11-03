import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { WaitForWindowAction } from '../../../data/model/action/wait-for-window/wait-for-window';
import { Maybe, none, some } from '../../common/maybe';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class WaitForWindowActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action): Maybe<WaitForWindowAction> {
    if (dto.type === ActionType.Enum.WAIT_FOR_WINDOW) {
      return some({
        ...this.mapToDomainBase(dto),
        type: dto.type,
        executable: this.actionValueMapper.mapToEnumDomain(dto.executable),
        title: this.actionValueMapper.mapToEnumDomain(dto.title),
        waitSeconds: this.actionValueMapper.mapToNumberDomain(dto.waitSeconds),
      });
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<WaitForWindowAction> {
    if (domain.type === ActionType.Enum.WAIT_FOR_WINDOW) {
      return some({
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        executable: this.actionValueMapper.mapFromEnumDomain(domain.executable),
        title: this.actionValueMapper.mapFromEnumDomain(domain.title),
        waitSeconds: this.actionValueMapper.mapFromNumberDomain(
          domain.waitSeconds
        ),
      });
    }
    return none();
  }
}
