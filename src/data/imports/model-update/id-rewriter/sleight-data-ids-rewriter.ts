import { getRandomId } from '../../../../core/common/random-id';
import {
  ActionIdRewriterArray,
  ContextIdRewriterArray,
  SelectorIdRewriterArray,
  SpecIdRewriterArray,
  VariableIdRewriterArray,
} from '../../../../di/di-collection-types';
import { SleightDataInternalFormat } from '../../../data-formats';
import { CommandIdRewriter } from './command-id-rewriter';

export type SleightDataIdsRewriter = {
  rewriteIds: (data: SleightDataInternalFormat) => SleightDataInternalFormat;
};

export class DefaultSleightDataIdsRewriter implements SleightDataIdsRewriter {
  constructor(
    private actionIdRewriters: ActionIdRewriterArray,
    private commandIdRewriter: CommandIdRewriter,
    private contextIdRewriters: ContextIdRewriterArray,
    private selectorIdRewriters: SelectorIdRewriterArray,
    private specIdRewriters: SpecIdRewriterArray,
    private variableIdRewriters: VariableIdRewriterArray
  ) {}

  rewriteIds(data: SleightDataInternalFormat): SleightDataInternalFormat {
    for (const action of Object.values(data.actions)) {
      const newActionId = getRandomId();
      for (const actionIdRewriter of this.actionIdRewriters) {
        data = actionIdRewriter.rewriteId(action, newActionId, data);
      }
    }

    for (const command of Object.values(data.commands)) {
      const newCommandId = getRandomId();
      data = this.commandIdRewriter.rewriteId(command, newCommandId, data);
    }

    for (const context of Object.values(data.contexts)) {
      const newContextId = getRandomId();
      for (const contextIdRewriter of this.contextIdRewriters) {
        data = contextIdRewriter.rewriteId(context, newContextId, data);
      }
    }

    for (const selector of Object.values(data.selectors)) {
      const newSelectorId = getRandomId();
      for (const selectorIdRewriter of this.selectorIdRewriters) {
        data = selectorIdRewriter.rewriteId(selector, newSelectorId, data);
      }
    }

    for (const spec of Object.values(data.specs)) {
      const newSpecId = getRandomId();
      for (const specIdRewriter of this.specIdRewriters) {
        data = specIdRewriter.rewriteId(spec, newSpecId, data);
      }
    }

    for (const variable of Object.values(data.variables)) {
      const newVariableId = getRandomId();
      for (const variableIdRewriter of this.variableIdRewriters) {
        data = variableIdRewriter.rewriteId(variable, newVariableId, data);
      }
    }

    return data;
  }
}
