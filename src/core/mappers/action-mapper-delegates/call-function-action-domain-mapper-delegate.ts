import { Action } from '../../../data/model/action/action';
import { ActionType } from '../../../data/model/action/action-types';
import {
  isEnumActionValue,
  isNumberActionValue,
  isTextActionValue,
} from '../../../data/model/action/action-value';
import { CallFunctionAction } from '../../../data/model/action/call-function/call-function';
import { MissingGuardError } from '../../../error/missing-guard-error';
import { Maybe, none, some } from '../../common/maybe';
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

  mapToDomain(dto: Action): Maybe<CallFunctionAction> {
    if (dto.type === ActionType.Enum.CALL_FUNCTION) {
      return some({
        ...this.mapToDomainBase(dto),
        type: dto.type,
        functionId: dto.functionId,
        parameters: dto.parameters.map((param) => {
          if (isTextActionValue(param)) {
            return this.actionValueMapper.mapToTextDomain(param);
          } else if (isNumberActionValue(param)) {
            return this.actionValueMapper.mapToNumberDomain(param);
          } else if (isEnumActionValue(param)) {
            return this.actionValueMapper.mapToEnumDomain(param);
          } else {
            throw new MissingGuardError(
              'CallFunctionActionDomainMapperDelegate'
            );
          }
        }),
      });
    }
    return none();
  }

  mapFromDomain(domain: Action): Maybe<CallFunctionAction> {
    if (domain.type === ActionType.Enum.CALL_FUNCTION) {
      return some({
        ...this.mapFromDomainBase(domain),
        type: domain.type,
        functionId: domain.functionId,
        parameters: domain.parameters.map((param) => {
          if (isTextActionValue(param)) {
            return this.actionValueMapper.mapFromTextDomain(param);
          } else if (isNumberActionValue(param)) {
            return this.actionValueMapper.mapFromNumberDomain(param);
          } else if (isEnumActionValue(param)) {
            return this.actionValueMapper.mapFromEnumDomain(param);
          } else {
            throw new MissingGuardError(
              'CallFunctionActionDomainMapperDelegate'
            );
          }
        }),
      });
    }
    return none();
  }
}
