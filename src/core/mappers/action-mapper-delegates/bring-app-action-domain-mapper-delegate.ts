import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { BringAppAction } from '../../../data/model/action/bring-app/bring-app';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class BringAppActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action): BringAppAction | undefined {
    if (dto.type === ActionType.Enum.BRING_APP) {
      return {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        appPath: this.actionValueMapper.mapToEnumDomain(dto.appPath),
        appTitle: this.actionValueMapper.mapToEnumDomain(dto.appTitle),
        startDir: this.actionValueMapper.mapToEnumDomain(dto.startDir),
      };
    }
  }

  mapFromDomain(domain: Action): BringAppAction | undefined {
    if (domain.type === ActionType.Enum.BRING_APP) {
      return {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        appPath: this.actionValueMapper.mapFromEnumDomain(domain.appPath),
        appTitle: this.actionValueMapper.mapFromEnumDomain(domain.appTitle),
        startDir: this.actionValueMapper.mapFromEnumDomain(domain.startDir),
      };
    }
  }
}
