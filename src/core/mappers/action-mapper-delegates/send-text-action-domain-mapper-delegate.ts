import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { SendTextAction } from '../../../data/model/action/send-text/send-text';
import { Maybe, none, some } from '../../common/maybe';
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

  mapToDomain(dto: Action): Maybe<SendTextAction> {
    if (dto.type === ActionType.Enum.SEND_TEXT) {
      return some({
        ...this.mapToDomainBase(dto),
        type: dto.type,
        text: this.actionValueMapper.mapToTextDomain(dto.text),
      });
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<SendTextAction> {
    if (domain.type === ActionType.Enum.SEND_TEXT) {
      return some({
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        text: this.actionValueMapper.mapFromTextDomain(domain.text),
      });
    }
    return none();
  }
}
