import { SleightDataInternalFormat } from '../../../data-formats';
import { SpecDTO } from '../../../model/spec/spec-dto';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites a spec's id within commands which use that spec. */
export class SpecIdWithinCommandsRewriter implements IdRewriter<SpecDTO> {
  rewriteId(spec: SpecDTO, newId: string, data: SleightDataInternalFormat) {
    const oldId = spec.id;

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
