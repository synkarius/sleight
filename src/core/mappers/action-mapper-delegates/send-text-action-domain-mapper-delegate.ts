import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { SendTextAction } from '../../../data/model/action/send-text/send-text';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class SendTextActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action): SendTextAction | undefined {
    if (dto.type === ActionType.Enum.SEND_TEXT) {
      return {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        text: this.actionValueMapper.mapToTextDomain(dto.text),
      };
    }
  }

  mapFromDomain(domain: Action): SendTextAction | undefined {
    if (domain.type === ActionType.Enum.SEND_TEXT) {
      return {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        text: this.actionValueMapper.mapFromTextDomain(domain.text),
      };
    }
  }
}
