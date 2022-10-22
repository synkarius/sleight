import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import { MouseAction } from '../../../data/model/action/mouse/mouse';
import { MouseActionType } from '../../../data/model/action/mouse/mouse-action-type';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class MouseActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action): MouseAction | undefined {
    if (dto.type === ActionType.Enum.MOUSE) {
      const base = {
        ...this.mapToDomainBase(dto),
        type: dto.type,
      };
      const mouseActionType = dto.mouseActionType;
      switch (mouseActionType) {
        case MouseActionType.Enum.MOVE:
          return {
            ...base,
            mouseActionType: dto.mouseActionType,
            mouseMovementType: dto.mouseMovementType,
            x: this.actionValueMapper.mapToNumberDomain(dto.x),
            y: this.actionValueMapper.mapToNumberDomain(dto.y),
          };
        case MouseActionType.Enum.CLICK:
          return {
            ...base,
            mouseActionType: dto.mouseActionType,
            mouseButton: this.actionValueMapper.mapToEnumDomain(
              dto.mouseButton
            ),
            pause: this.actionValueMapper.mapToNumberDomain(dto.pause),
            repeat: this.actionValueMapper.mapToNumberDomain(dto.repeat),
          };
        case MouseActionType.Enum.HOLD_RELEASE:
          return {
            ...base,
            mouseActionType: dto.mouseActionType,
            mouseButton: this.actionValueMapper.mapToEnumDomain(
              dto.mouseButton
            ),
            pause: this.actionValueMapper.mapToNumberDomain(dto.pause),
            direction: this.actionValueMapper.mapToEnumDomain(dto.direction),
          };
        default:
          throw new ExhaustivenessFailureError(mouseActionType);
      }
    }
  }

  mapFromDomain(domain: Action): MouseAction | undefined {
    if (domain.type === ActionType.Enum.MOUSE) {
      const base = {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
      };
      const mouseActionType = domain.mouseActionType;
      switch (mouseActionType) {
        case MouseActionType.Enum.MOVE:
          return {
            ...base,
            mouseActionType: domain.mouseActionType,
            mouseMovementType: domain.mouseMovementType,
            x: this.actionValueMapper.mapFromNumberDomain(domain.x),
            y: this.actionValueMapper.mapFromNumberDomain(domain.y),
          };
        case MouseActionType.Enum.CLICK:
          return {
            ...base,
            mouseActionType: domain.mouseActionType,
            mouseButton: this.actionValueMapper.mapFromEnumDomain(
              domain.mouseButton
            ),
            pause: this.actionValueMapper.mapFromNumberDomain(domain.pause),
            repeat: this.actionValueMapper.mapFromNumberDomain(domain.repeat),
          };
        case MouseActionType.Enum.HOLD_RELEASE:
          return {
            ...base,
            mouseActionType: domain.mouseActionType,
            mouseButton: this.actionValueMapper.mapFromEnumDomain(
              domain.mouseButton
            ),
            pause: this.actionValueMapper.mapFromNumberDomain(domain.pause),
            direction: this.actionValueMapper.mapFromEnumDomain(
              domain.direction
            ),
          };
        default:
          throw new ExhaustivenessFailureError(mouseActionType);
      }
    }
  }
}
