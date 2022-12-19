import { SleightDataInternalFormat } from '../../../data-formats';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a context's id within commands which use that context. */
export class ContextIdWithinCommandsRewriter implements IdRewriter {
  rewriteId(oldId: string, newId: string, data: SleightDataInternalFormat) {
    const commands = Object.values(data.commands)
      .map((command) => {
        return {
          ...command,
          contextId: command.contextId === oldId ? newId : command.contextId,
        };
      })
      .reduce(reduceIded, {});

    return {
      ...data,
      commands,
    };
  }
}
