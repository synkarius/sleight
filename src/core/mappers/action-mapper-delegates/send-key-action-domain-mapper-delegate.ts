import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import {
  Modifiers,
  SendKeyAction,
} from '../../../data/model/action/send-key/send-key';
import { SendKeyMode } from '../../../data/model/action/send-key/send-key-modes';
import { Maybe, none, some } from '../../common/maybe';
import { DomainMapper } from '../mapper';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class SendKeyActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(
    private actionValueMapper: MultiMethodActionValueMapper,
    private modifiersMapper: DomainMapper<Modifiers, Modifiers>
  ) {
    super();
  }

  mapToDomain(dto: Action): Maybe<SendKeyAction> {
    if (dto.type === ActionType.Enum.SEND_KEY) {
      const sendKey = {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        modifiers: this.modifiersMapper.mapToDomain(dto.modifiers),
        keyToSend: this.actionValueMapper.mapFromEnumDomain(dto.keyToSend),
        outerPause: this.actionValueMapper.mapToNumberDomain(dto.outerPause),
      };
      if (dto.sendKeyMode === SendKeyMode.Enum.PRESS) {
        return some({
          ...sendKey,
          sendKeyMode: dto.sendKeyMode,
          innerPause: this.actionValueMapper.mapToNumberDomain(dto.innerPause),
          repeat: this.actionValueMapper.mapToNumberDomain(dto.repeat),
        });
      } else {
        return some({
          ...sendKey,
          sendKeyMode: dto.sendKeyMode,
          direction: this.actionValueMapper.mapToEnumDomain(dto.direction),
        });
      }
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<SendKeyAction> {
    if (domain.type === ActionType.Enum.SEND_KEY) {
      const sendKey = {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        modifiers: this.modifiersMapper.mapFromDomain(domain.modifiers),
        keyToSend: this.actionValueMapper.mapFromEnumDomain(domain.keyToSend),
        outerPause: this.actionValueMapper.mapFromNumberDomain(
          domain.outerPause
        ),
      };
      if (domain.sendKeyMode === SendKeyMode.Enum.PRESS) {
        return some({
          ...sendKey,
          sendKeyMode: domain.sendKeyMode,
          innerPause: this.actionValueMapper.mapFromNumberDomain(
            domain.innerPause
          ),
          repeat: this.actionValueMapper.mapFromNumberDomain(domain.repeat),
        });
      } else {
        return some({
          ...sendKey,
          sendKeyMode: domain.sendKeyMode,
          direction: this.actionValueMapper.mapFromEnumDomain(domain.direction),
        });
      }
    }
    return none();
  }
}
