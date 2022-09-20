import { Action } from '../../../model/action/action';
import { reduceIded } from '../reduce-ided';
import { IdRewriter } from './id-rewriter';

export const getCommandActionIdsRewriter = (): IdRewriter<Action> => {
  return {
    rewriteId: (action, newId, data) => {
      // replace id in action object and slice
      const oldId = action.id;

      // TODO: move this replacement to action id rewriter which uses this
      //   const removed = Object.values(data.actions)
      //     .filter((ided) => ided.id !== oldId)
      //     .reduce(reduceIded, {});
      //   const newAction = { ...action, id: newId };
      //   const added = { ...removed, [newId]: newAction };

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
    },
  };
};
