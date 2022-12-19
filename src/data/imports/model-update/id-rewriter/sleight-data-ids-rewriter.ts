import { getRandomId } from '../../../../core/common/random-id';
import {
  ActionIdRewriterArray,
  CommandIdRewriterArray,
  ContextIdRewriterArray,
  FnIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../../../../di/di-collection-types';
import { SleightDataInternalFormat } from '../../../data-formats';
import { Ided } from '../../../model/domain';
import { IdRewriter } from './id-rewriter';
import { SleightDataIdsRewriteResult } from './sleight-data-ids-rewrite-result';

export type SleightDataIdsRewriter = {
  rewriteIds: (data: SleightDataInternalFormat) => SleightDataIdsRewriteResult;
};

export class DefaultSleightDataIdsRewriter implements SleightDataIdsRewriter {
  constructor(
    private actionIdRewriters: ActionIdRewriterArray,
    private commandIdRewriters: CommandIdRewriterArray,
    private contextIdRewriters: ContextIdRewriterArray,
    private fnIdRewriters: FnIdRewriterArray,
    private selectorIdRewriters: SelectorIdRewriterArray,
    private specIdRewriters: SpecIdRewriterArray,
    private variableIdRewriters: VariableIdRewriterArray
  ) {}

  rewriteIds(data: SleightDataInternalFormat): SleightDataIdsRewriteResult {
    const idTransforms = [
      getIdTransform((data) => data.actions, this.actionIdRewriters),
      getIdTransform((data) => data.commands, this.commandIdRewriters),
      getIdTransform((data) => data.contexts, this.contextIdRewriters),
      getIdTransform((data) => data.fns, this.fnIdRewriters),
      getIdTransform((data) => data.selectors, this.selectorIdRewriters),
      getIdTransform((data) => data.specs, this.specIdRewriters),
      getIdTransform((data) => data.variables, this.variableIdRewriters),
    ];
    const idMaps: Record<string, string>[] = [];
    for (const idTransform of idTransforms) {
      const result = this.rewriteSlice(
        data,
        idTransform.sliceFn(data),
        idTransform.idRewriters
      );
      data = result.data;
      idMaps.push(result.idMap);
    }

    // TODO: This sucks. Refactor to not use array indices.
    return {
      idsMap: {
        actions: idMaps[0],
        commands: idMaps[1],
        contexts: idMaps[2],
        fns: idMaps[3],
        selectors: idMaps[4],
        specs: idMaps[5],
        variables: idMaps[6],
      },
      rewrittenData: data,
    };
  }

  private rewriteSlice<T extends Ided>(
    data: SleightDataInternalFormat,
    slice: Record<string, T>,
    idRewriters: Array<IdRewriter>
  ): SingleSliceRewriteResult {
    const idMap: Record<string, string> = {};
    for (const ided of Object.values(slice)) {
      const newId = getRandomId();
      idMap[ided.id] = newId;
      for (const idRewriter of idRewriters) {
        data = idRewriter.rewriteId(ided.id, newId, data);
      }
    }
    return {
      idMap,
      data,
    };
  }
}

type SingleSliceRewriteResult = {
  idMap: Record<string, string>;
  data: SleightDataInternalFormat;
};

type IdTransform = {
  sliceFn: (data: SleightDataInternalFormat) => Readonly<Record<string, Ided>>;
  idRewriters: IdRewriter[];
};

const getIdTransform = (
  sliceFn: (data: SleightDataInternalFormat) => Readonly<Record<string, Ided>>,
  idRewriters: IdRewriter[]
): IdTransform => {
  return { sliceFn, idRewriters };
};
