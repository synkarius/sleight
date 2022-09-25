import { SleightDataInternalFormat } from '../../../data-formats';
import { Action } from '../../../model/action/action';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export class CommandActionIdsRewriter implements IdRewriter<Action> {
  rewriteId(
    action: Action,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    // replace id in action object and slice
    const oldId = action.id;

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
