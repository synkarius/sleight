import { ActionType } from '../../../data/model/action/action-types';
import { SendKeyMode } from '../../../data/model/action/send-key/send-key-modes';
import { getAbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { getEnumActionValueDomainMapper } from './action-value-mapper/enum-action-value-domain-mapper';
import { getNumericActionValueDomainMapper } from './action-value-mapper/numeric-action-value-domain-mapper';
import { getSendKeyModifiersDomainMapper } from './send-key-modifiers-domain-mapper';

export const getSendKeyDomainMapperDelegate =
  (): ActionDomainMapperDelegate => {
    const abstractDelegate = getAbstractActionDomainMapperDelegate();
    const modifiersMapper = getSendKeyModifiersDomainMapper();
    const enumActionValueMapper = getEnumActionValueDomainMapper();
    const numericActionValueMapper = getNumericActionValueDomainMapper();
    return {
      mapToDomain: (dto) => {
        if (dto.type === ActionType.Enum.SEND_KEY) {
          const sendKey = {
            ...abstractDelegate.mapToDomain(dto),
            type: dto.type,
            modifiers: modifiersMapper.mapToDomain(dto.modifiers),
            keyToSend: enumActionValueMapper.mapToDomain(dto.keyToSend),
            outerPause: numericActionValueMapper.mapToDomain(dto.outerPause),
          };
          if (dto.sendKeyMode === SendKeyMode.Enum.PRESS) {
            return {
              ...sendKey,
              sendKeyMode: dto.sendKeyMode,
              innerPause: numericActionValueMapper.mapToDomain(dto.innerPause),
              repeat: numericActionValueMapper.mapToDomain(dto.repeat),
            };
          } else {
            return {
              ...sendKey,
              sendKeyMode: dto.sendKeyMode,
              direction: enumActionValueMapper.mapToDomain(dto.direction),
            };
          }
        }
      },
      mapFromDomain: (domain) => {
        if (domain.type === ActionType.Enum.SEND_KEY) {
          const sendKey = {
            ...abstractDelegate.mapFromDomain(domain),
            type: domain.type,
            modifiers: modifiersMapper.mapFromDomain(domain.modifiers),
            keyToSend: enumActionValueMapper.mapFromDomain(domain.keyToSend),
            outerPause: numericActionValueMapper.mapFromDomain(
              domain.outerPause
            ),
          };
          if (domain.sendKeyMode === SendKeyMode.Enum.PRESS) {
            return {
              ...sendKey,
              sendKeyMode: domain.sendKeyMode,
              innerPause: numericActionValueMapper.mapFromDomain(
                domain.innerPause
              ),
              repeat: numericActionValueMapper.mapFromDomain(domain.repeat),
            };
          } else {
            return {
              ...sendKey,
              sendKeyMode: domain.sendKeyMode,
              direction: enumActionValueMapper.mapFromDomain(domain.direction),
            };
          }
        }
      },
    };
  };
