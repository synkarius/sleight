import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { MimicAction } from '../../../data/model/action/mimic/mimic';
import { Maybe, none, some } from '../../common/maybe';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class MimicActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action): Maybe<MimicAction> {
    if (dto.type === ActionType.Enum.MIMIC) {
      return some({
        ...this.mapToDomainBase(dto),
        type: dto.type,
        words: this.actionValueMapper.mapToTextDomain(dto.words),
      });
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<MimicAction> {
    if (domain.type === ActionType.Enum.MIMIC) {
      return some({
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        words: this.actionValueMapper.mapFromTextDomain(domain.words),
      });
    }
    return none();
  }
}
