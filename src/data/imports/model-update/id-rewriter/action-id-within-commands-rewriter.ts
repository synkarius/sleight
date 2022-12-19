import { SleightDataInternalFormat } from '../../../data-formats';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

/** Rewrites an action's id within commands which use that action. */
export class ActionIdWithinCommandsRewriter implements IdRewriter {
  rewriteId(
    oldId: string,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    // replace id in action object and slice

    // replace action id in commands
    const newCommands = Object.values(data.commands)
      .map((command) => {
        if (command.actionIds.includes(oldId)) {
          return {
            ...command,
            actionIds: command.actionIds.map((actionId) =>
              actionId === oldId ? newId : actionId
            ),
          };
        }
        return command;
      })
      .reduce(reduceIded, {});

    return { ...data, commands: newCommands };
  }
}
