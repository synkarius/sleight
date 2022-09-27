import { MissingRoleKeyError } from '../../../error/missing-role-key-error';
import { SleightDataInternalFormat } from '../../data-formats';
import { ImportTargetable } from './import-targetable';
import { reduceIded } from './reduce-ided';

/** updates base data with rolekeyed-only deserialized import data */
export type RoleKeyedDataUpdater = {
  update: (
    base: SleightDataInternalFormat,
    roleKeyedDeserialized: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export class DefaultRoleKeyedDataUpdater implements RoleKeyedDataUpdater {
  update(
    base: SleightDataInternalFormat,
    rkDeserialized: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      actions: this.updateTargets(base.actions, rkDeserialized.actions),
      commands: this.updateTargets(base.commands, rkDeserialized.commands),
      contexts: this.updateTargets(base.contexts, rkDeserialized.contexts),
      selectors: base.selectors,
      specs: this.updateTargets(base.specs, rkDeserialized.specs),
      variables: this.updateTargets(base.variables, rkDeserialized.variables),
    };
  }

  updateTargets<T extends ImportTargetable>(
    baseRec: Record<string, T>,
    deserializedRec: Record<string, T>
  ): Record<string, T> {
    const baseElements = Object.values(baseRec);
    const overrides = Object.values(deserializedRec)
      .map((deserializedElement) => {
        const matchingBaseElement = baseElements.find(
          (baseElement) => baseElement.roleKey === deserializedElement.roleKey
        );
        if (matchingBaseElement) {
          return {
            ...deserializedElement,
            id: matchingBaseElement.id,
          };
        }
        throw new MissingRoleKeyError(deserializedElement);
      })
      .reduce(reduceIded, {});
    return {
      ...baseRec,
      ...overrides,
    };
  }
}
