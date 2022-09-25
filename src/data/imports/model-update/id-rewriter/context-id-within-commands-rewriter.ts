import { SleightDataInternalFormat } from '../../../data-formats';
import { Context } from '../../../model/context/context';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a context's id within commands which use that context. */
export class ContextIdWithinCommandsRewriter implements IdRewriter<Context> {
  rewriteId(context: Context, newId: string, data: SleightDataInternalFormat) {
    const oldId = context.id;

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
