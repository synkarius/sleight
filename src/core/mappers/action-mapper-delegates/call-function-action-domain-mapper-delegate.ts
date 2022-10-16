import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import {
  ActionValue,
  isEnumActionValue,
  isNumberActionValue,
  isTextActionValue,
} from '../../../data/model/action/action-value';
import { MissingGuardError } from '../../../error/missing-guard-error';
import { AbstractActionDomainMapperDelegate } from './abstract-action-domain-mapper-delegate';
import { ActionDomainMapperDelegate } from './action-domain-mapper-delegate';
import { MultiMethodActionValueMapper } from './action-value-mapper/delegating-action-value-domain-mapper';

export class CallFunctionActionDomainMapperDelegate
  extends AbstractActionDomainMapperDelegate
  implements ActionDomainMapperDelegate
{
  constructor(private actionValueMapper: MultiMethodActionValueMapper) {
    super();
  }

  mapToDomain(dto: Action) {
    if (dto.type === ActionType.Enum.CALL_FUNCTION) {
      return {
        ...this.mapToDomainBase(dto),
        type: dto.type,
        functionId: dto.functionId,
        parameters: dto.parameters.map((param) => {
          if (isTextActionValue(param)) {
            return this.actionValueMapper.mapToTextDomain(param);
          } else if (isNumberActionValue(param)) {
            return this.actionValueMapper.mapToNumericDomain(param);
          } else if (isEnumActionValue(param)) {
            return this.actionValueMapper.mapToEnumDomain(param);
          } else {
            throw new MissingGuardError(
              'CallFunctionActionDomainMapperDelegate'
            );
          }
        }),
      };
    }
  }

  mapFromDomain(domain: Action) {
    if (domain.type === ActionType.Enum.CALL_FUNCTION) {
      return {
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        functionId: domain.functionId,
        parameters: domain.parameters.map((param) => {
          if (isTextActionValue(param)) {
            return this.actionValueMapper.mapFromTextDomain(param);
          } else if (isNumberActionValue(param)) {
            return this.actionValueMapper.mapFromNumericDomain(param);
          } else if (isEnumActionValue(param)) {
            return this.actionValueMapper.mapFromEnumDomain(param);
          } else {
            throw new MissingGuardError(
              'CallFunctionActionDomainMapperDelegate'
            );
          }
        }),
      };
    }
  }
}
