import {
  ActionValue,
  EnumActionValue,
  NumberActionValue,
  TextActionValue,
} from '../../../../data/model/action/action-value';
import { ActionValueType } from '../../../../data/model/action/action-value-type';
import { VariableType } from '../../../../data/model/variable/variable-types';
import { ExhaustivenessFailureError } from '../../../../error/exhaustiveness-failure-error';
import { DomainMapper } from '../../mapper';
import { EnterEnumActionValueDomainMapperDelegate } from './enter-enum-action-value-domain-mapper-delegate';
import { EnterNumberActionValueDomainMapperDelegate } from './enter-numeric-action-value-domain-mapper-delegate';
import { EnterTextActionValueDomainMapperDelegate } from './enter-text-action-value-domain-mapper-delegate';
import { VariableEnumActionValueDomainMapperDelegate } from './variable-enum-action-value-domain-mapper-delegate';
import { VariableNumericActionValueDomainMapperDelegate } from './variable-numeric-action-value-domain-mapper-delegate';
import { VariableTextActionValueDomainMapperDelegate } from './variable-text-action-value-domain-mapper-delegate';

export interface MultiMethodActionValueMapper
  extends DomainMapper<ActionValue, ActionValue> {
  mapToTextDomain: (dto: TextActionValue) => TextActionValue;
  mapFromTextDomain: (domain: TextActionValue) => TextActionValue;

  mapToNumberDomain: (dto: NumberActionValue) => NumberActionValue;
  mapFromNumberDomain: (domain: NumberActionValue) => NumberActionValue;

  mapToEnumDomain: (dto: EnumActionValue) => EnumActionValue;
  mapFromEnumDomain: (domain: EnumActionValue) => EnumActionValue;
}

export class DelegatingActionValueDomainMapper
  implements MultiMethodActionValueMapper
{
  constructor(
    private enterTextValueDelegate: EnterTextActionValueDomainMapperDelegate,
    private enterNumberValueDelegate: EnterNumberActionValueDomainMapperDelegate,
    private enterEnumValueDelegate: EnterEnumActionValueDomainMapperDelegate,
    private variableTextDelegate: VariableTextActionValueDomainMapperDelegate,
    private variableNumberDelegate: VariableNumericActionValueDomainMapperDelegate,
    private variableEnumDelegate: VariableEnumActionValueDomainMapperDelegate
  ) {}

  mapToTextDomain(dto: TextActionValue) {
    return dto.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterTextValueDelegate.mapToDomain(dto)
      : this.variableTextDelegate.mapToDomain(dto);
  }

  mapFromTextDomain(domain: TextActionValue) {
    return domain.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterTextValueDelegate.mapFromDomain(domain)
      : this.variableTextDelegate.mapFromDomain(domain);
  }

  mapToNumberDomain(dto: NumberActionValue) {
    return dto.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterNumberValueDelegate.mapToDomain(dto)
      : this.variableNumberDelegate.mapToDomain(dto);
  }

  mapFromNumberDomain(domain: NumberActionValue) {
    return domain.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterNumberValueDelegate.mapFromDomain(domain)
      : this.variableNumberDelegate.mapFromDomain(domain);
  }

  mapToEnumDomain(dto: EnumActionValue) {
    return dto.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterEnumValueDelegate.mapToDomain(dto)
      : this.variableEnumDelegate.mapToDomain(dto);
  }

  mapFromEnumDomain(domain: EnumActionValue) {
    return domain.actionValueType === ActionValueType.Enum.ENTER_VALUE
      ? this.enterEnumValueDelegate.mapFromDomain(domain)
      : this.variableEnumDelegate.mapFromDomain(domain);
  }

  mapToDomain(dto: ActionValue) {
    const actionValueType = dto.actionValueType;
    if (actionValueType === ActionValueType.Enum.ENTER_VALUE) {
      const enteredValueType = dto.enteredValueType;
      switch (enteredValueType) {
        case VariableType.Enum.TEXT:
          return this.enterTextValueDelegate.mapToDomain(dto);
        case VariableType.Enum.NUMBER:
          return this.enterNumberValueDelegate.mapToDomain(dto);
        case VariableType.Enum.ENUM:
          return this.enterEnumValueDelegate.mapToDomain(dto);
        default:
          throw new ExhaustivenessFailureError(enteredValueType);
      }
    } else if (actionValueType === ActionValueType.Enum.USE_VARIABLE) {
      const variableType = dto.variableType;
      switch (variableType) {
        case VariableType.Enum.TEXT:
          return this.variableTextDelegate.mapToDomain(dto);
        case VariableType.Enum.NUMBER:
          return this.variableNumberDelegate.mapToDomain(dto);
        case VariableType.Enum.ENUM:
          return this.variableEnumDelegate.mapToDomain(dto);
        default:
          throw new ExhaustivenessFailureError(variableType);
      }
    } else {
      throw new ExhaustivenessFailureError(actionValueType);
    }
  }

  mapFromDomain(domain: ActionValue) {
    const actionValueType = domain.actionValueType;
    if (actionValueType === ActionValueType.Enum.ENTER_VALUE) {
      const enteredValueType = domain.enteredValueType;
      switch (enteredValueType) {
        case VariableType.Enum.TEXT:
          return this.enterTextValueDelegate.mapToDomain(domain);
        case VariableType.Enum.NUMBER:
          return this.enterNumberValueDelegate.mapToDomain(domain);
        case VariableType.Enum.ENUM:
          return this.enterEnumValueDelegate.mapToDomain(domain);
        default:
          throw new ExhaustivenessFailureError(enteredValueType);
      }
    } else if (actionValueType === ActionValueType.Enum.USE_VARIABLE) {
      const variableType = domain.variableType;
      switch (variableType) {
        case VariableType.Enum.TEXT:
          return this.variableTextDelegate.mapToDomain(domain);
        case VariableType.Enum.NUMBER:
          return this.variableNumberDelegate.mapToDomain(domain);
        case VariableType.Enum.ENUM:
          return this.variableEnumDelegate.mapToDomain(domain);
        default:
          throw new ExhaustivenessFailureError(variableType);
      }
    } else {
      throw new ExhaustivenessFailureError(actionValueType);
    }
  }
}
