import { FnParameter, PythonFnParameter } from '../../data/model/fn/fn';
import { DomainMapper } from './mapper';

export class DefaultFnParameterMapper
  implements DomainMapper<FnParameter, FnParameter>
{
  mapToDomain(dto: PythonFnParameter): PythonFnParameter {
    return { id: dto.id, type: dto.type, name: dto.name };
  }

  mapFromDomain(domain: PythonFnParameter): PythonFnParameter {
    return { id: domain.id, type: domain.type, name: domain.name };
  }
}
