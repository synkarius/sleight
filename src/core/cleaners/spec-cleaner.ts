import { SpecDTO } from '../../data/model/spec/spec-dto';
import { Cleaner } from './cleaner';

export class DefaultSpecCleaner implements Cleaner<SpecDTO> {
  clean(specs: Readonly<SpecDTO[]>): SpecDTO[] {
    return specs.map((spec) => ({
      id: spec.id,
      name: spec.name,
      roleKey: spec.roleKey,
      items: spec.items.map((item) => ({
        id: item.id,
        itemType: item.itemType,
        itemId: item.itemId,
        optional: item.optional,
        grouped: item.grouped,
      })),
      enabled: spec.enabled,
      locked: spec.locked,
    }));
  }
}
