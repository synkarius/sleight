import { SleightDataInternalFormat } from '../../../data-formats';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a spec's id within commands which use that spec. */
export class SpecIdWithinCommandsRewriter implements IdRewriter {
  rewriteId(oldId: string, newId: string, data: SleightDataInternalFormat) {
    const commands = Object.values(data.commands)
      .map((command) => {
        return {
          ...command,
          specId: command.specId === oldId ? newId : command.specId,
        };
      })
      .reduce(reduceIded, {});

    return {
      ...data,
      commands,
    };
  }
}
