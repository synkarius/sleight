import { SleightDataInternalFormat } from '../../../data-formats';
import { Command } from '../../../model/command/command';
import { IdRewriter, replaceIdInSlice } from './id-rewriter';

export class CommandIdRewriter implements IdRewriter<Command> {
  rewriteId(
    command: Command,
    newId: string,
    data: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    return {
      ...data,
      commands: replaceIdInSlice(command, newId, data.commands),
    };
  }
}
