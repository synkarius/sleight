import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { Modifiers } from '../../../data/model/action/send-key/send-key';
import { SendKeyMode } from '../../../data/model/action/send-key/send-key-modes';
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

  mapToDomain(dto: Action) {
    if (dto.type === ActionType.Enum.SEND_KEY) {
      const sendKey = {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        modifiers: this.modifiersMapper.mapToDomain(dto.modifiers),
        keyToSend: this.actionValueMapper.mapFromEnumDomain(dto.keyToSend),
        outerPause: this.actionValueMapper.mapToNumericDomain(dto.outerPause),
      };
      if (dto.sendKeyMode === SendKeyMode.Enum.PRESS) {
        return {
          ...sendKey,
          sendKeyMode: dto.sendKeyMode,
          innerPause: this.actionValueMapper.mapToNumericDomain(dto.innerPause),
          repeat: this.actionValueMapper.mapToNumericDomain(dto.repeat),
        };
      } else {
        return {
          ...sendKey,
          sendKeyMode: dto.sendKeyMode,
          direction: this.actionValueMapper.mapToEnumDomain(dto.direction),
        };
      }
    }
  }

  mapFromDomain(domain: Action) {
    if (domain.type === ActionType.Enum.SEND_KEY) {
      const sendKey = {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        modifiers: this.modifiersMapper.mapFromDomain(domain.modifiers),
        keyToSend: this.actionValueMapper.mapFromEnumDomain(domain.keyToSend),
        outerPause: this.actionValueMapper.mapFromNumericDomain(
          domain.outerPause
        ),
      };
      if (domain.sendKeyMode === SendKeyMode.Enum.PRESS) {
        return {
          ...sendKey,
          sendKeyMode: domain.sendKeyMode,
          innerPause: this.actionValueMapper.mapFromNumericDomain(
            domain.innerPause
          ),
          repeat: this.actionValueMapper.mapFromNumericDomain(domain.repeat),
        };
      } else {
        return {
          ...sendKey,
          sendKeyMode: domain.sendKeyMode,
          direction: this.actionValueMapper.mapFromEnumDomain(domain.direction),
        };
      }
    }
  }
}
