import { MapUtil } from '../../../core/common/map-util';
import {
  ActionIdRewriterArray,
  CommandIdRewriterArray,
  ContextIdRewriterArray,
  FnIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../../../di/di-collection-types';
import { MissingRoleKeyError } from '../../../error/missing-role-key-error';
import { SleightDataInternalFormat } from '../../data-formats';
import { Ided } from '../../model/domain';
import { IdRewriter } from './id-rewriter/id-rewriter';
import { IdsMap } from './id-rewriter/sleight-data-ids-rewrite-result';
import { ImportTargetable } from './import-targetable';
import { reduceIded } from './reduce-ided';

/** updates base data with rolekeyed-only deserialized import data */
export type RoleKeyedDataUpdater = {
  update: (
    /** full data */
    base: SleightDataInternalFormat,
    /** RKO is the rolekeyed elements only */
    roleKeyOverrides: SleightDataInternalFormat,
    /** `idsMap` is a map of elements which have ids rewritten:
     * original id to rewritten id
     */
    idsMap: IdsMap
  ) => SleightDataInternalFormat;
};

export class DefaultRoleKeyedDataUpdater implements RoleKeyedDataUpdater {
  constructor(
    private actionIdRewriters: ActionIdRewriterArray,
    private commandIdRewriters: CommandIdRewriterArray,
    private contextIdRewriters: ContextIdRewriterArray,
    private fnIdRewriters: FnIdRewriterArray,
    private selectorIdRewriters: SelectorIdRewriterArray,
    private specIdRewriters: SpecIdRewriterArray,
    private variableIdRewriters: VariableIdRewriterArray
  ) {}

  update(
    base: SleightDataInternalFormat,
    roleKeyOverrides: SleightDataInternalFormat,
    idsMap: IdsMap
  ): SleightDataInternalFormat {
    //
    /**
     * Replace ids of anything in `roleKeyOverrides` with anything in `base`.
     * This is so that `roleKeyOverrides` can just be merged onto `base`.
     *
     * NOTE:
     * =============
     * Selectors don't have role keys and therefore shouldn't be able to
     * get evaluated as OVERRIDE, and so shouldn't need any action here.
     *
     * Copying an IMPORTED+rolekeyed choice variable (or spec)
     * over an old one includes copying the IMPORTED selector id.
     * This is correct: if you, an author, rolekey a choice variable,
     * you're expecting your choice selectors to get updated by a targeted
     * import. What that means data-wise is that both the new and old selectors
     * survive, the old one possibly gets orphaned, and the updated variable/spec
     * refers to the newly imported selector.
     */
    const overrideTransforms = [
      getOverrideTransform(
        (data) => Object.values(data.actions),
        this.actionIdRewriters
      ),
      getOverrideTransform(
        (data) => Object.values(data.commands),
        this.commandIdRewriters
      ),
      getOverrideTransform(
        (data) => Object.values(data.contexts),
        this.contextIdRewriters
      ),
      getOverrideTransform(
        (data) => Object.values(data.fns),
        this.fnIdRewriters
      ),
      getOverrideTransform(
        (data) => Object.values(data.specs),
        this.specIdRewriters
      ),
      getOverrideTransform(
        (data) => Object.values(data.variables),
        this.variableIdRewriters
      ),
    ];
    let update = roleKeyOverrides;
    for (const overrideTransform of overrideTransforms) {
      update = this.applyBaseIdsToUpdate(
        overrideTransform.sliceFn(base),
        overrideTransform.sliceFn(roleKeyOverrides),
        update,
        overrideTransform.idRewriters
      );
    }

    /**
     * Applies rewritten ids from `idsMap` to `roleKeyOverrides` updates data.
     * Should not be replacing any primary `id` fields, only foreign keys.
     */
    update = this.applyRewrittenIdsToUpdate(idsMap, update);
    //
    return this.mergeUpdateOntoBase(update, base);
  }

  private applyBaseIdsToUpdate<T extends ImportTargetable>(
    base: T[],
    update: T[],
    data: SleightDataInternalFormat,
    idRewriters: IdRewriter[]
  ) {
    for (const override of Object.values(update)) {
      const matching = this.findRoleKeyMatchingElementInBaseData(
        override,
        base
      );
      const oldId = matching.id;
      data = this.rewriteSingleId(override.id, oldId, idRewriters, data);
    }
    return data;
  }

  private mergeUpdateOntoBase(
    update: SleightDataInternalFormat,
    base: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      actions: this.mergeUpdateOntoBaseSlice(base.actions, update.actions),
      commands: this.mergeUpdateOntoBaseSlice(base.commands, update.commands),
      contexts: this.mergeUpdateOntoBaseSlice(base.contexts, update.contexts),
      fns: this.mergeUpdateOntoBaseSlice(base.fns, update.fns),
      selectors: base.selectors,
      specs: this.mergeUpdateOntoBaseSlice(base.specs, update.specs),
      variables: this.mergeUpdateOntoBaseSlice(
        base.variables,
        update.variables
      ),
    };
  }

  private mergeUpdateOntoBaseSlice<T extends Ided>(
    base: Readonly<Record<string, T>>,
    update: Readonly<Record<string, T>>
  ): Record<string, T> {
    return [...Object.values(base), ...Object.values(update)].reduce(
      reduceIded,
      {}
    );
  }

  private findRoleKeyMatchingElementInBaseData<T extends ImportTargetable>(
    imported: T,
    base: T[]
  ): T {
    for (const targetable of base) {
      if (targetable.roleKey === imported.roleKey) {
        return targetable;
      }
    }
    throw new MissingRoleKeyError(imported);
  }

  private applyRewrittenIdsToUpdateSlice(
    rkoData: SleightDataInternalFormat,
    idsMapSlice: Record<string, string>,
    idRewriters: Array<IdRewriter>
  ): SleightDataInternalFormat {
    // idsMap is { original: rewritten }
    for (const oldId of Object.keys(idsMapSlice)) {
      const rewrittenId = MapUtil.getOrThrow(idsMapSlice, oldId);
      rkoData = this.rewriteSingleId(oldId, rewrittenId, idRewriters, rkoData);
    }
    return rkoData;
  }

  private applyRewrittenIdsToUpdate(
    idsMap: IdsMap,
    roleKeyOverrides: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    let rkoData = roleKeyOverrides;

    const rkoTransforms: RKOTransform[] = [
      getRKOTransform(idsMap.actions, this.actionIdRewriters),
      getRKOTransform(idsMap.commands, this.commandIdRewriters),
      getRKOTransform(idsMap.contexts, this.contextIdRewriters),
      getRKOTransform(idsMap.fns, this.fnIdRewriters),
      getRKOTransform(idsMap.selectors, this.selectorIdRewriters),
      getRKOTransform(idsMap.specs, this.specIdRewriters),
      getRKOTransform(idsMap.variables, this.variableIdRewriters),
    ];
    for (const rkoTransform of rkoTransforms) {
      rkoData = this.applyRewrittenIdsToUpdateSlice(
        rkoData,
        rkoTransform.idMapSlice,
        rkoTransform.idRewriters
      );
    }
    return rkoData;
  }

  private rewriteSingleId(
    oldId: string,
    newId: string,
    idRewriters: IdRewriter[],
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    for (const idRewriter of idRewriters) {
      const result = idRewriter.rewriteId(oldId, newId, data);
      data = result;
    }
    return data;
  }
}

type RKOTransform = {
  idMapSlice: Readonly<Record<string, string>>;
  idRewriters: IdRewriter[];
};

const getRKOTransform = (
  idMapSlice: Readonly<Record<string, string>>,
  idRewriters: IdRewriter[]
): RKOTransform => {
  return {
    idMapSlice,
    idRewriters,
  };
};

type OverrideTransform = {
  sliceFn: (data: SleightDataInternalFormat) => ImportTargetable[];
  idRewriters: IdRewriter[];
};

const getOverrideTransform = (
  sliceFn: (data: SleightDataInternalFormat) => ImportTargetable[],
  idRewriters: IdRewriter[]
): OverrideTransform => {
  return { sliceFn, idRewriters };
};
