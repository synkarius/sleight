import { Command } from '../../../model/command/command';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export const getCommandIdRewriter = (): IdRewriter<Command> => ({
  rewriteId: (command, newId, data) => {
    return {
      ...data,
      commands: replaceIdInSlice(command, newId, data.commands),
    };
  },
});
